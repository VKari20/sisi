import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { type Votes, type VoteResult } from "../types";
import { api } from "../utils/api";
import { useAuth } from "./useAuth";
import {useToast} from "../components/shared/ui/Toast";

type Choice = "support" | "reject";

// Voting needs a logged-in user. Visitors are sent to the login page and brought back afterwards.
export const useVote = (projectId: number, initialVotes: Votes) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast} = useToast();
  const [votes, setVotes] = useState(initialVotes);
  const [myVote, setMyVote] = useState<Choice | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const vote = async (choice: Choice) => {
  if (!user) {
    showToast("Please log in to vote on a proposal.", "info");
    navigate("/login", { state: { from: location.pathname } });
    return;
  }

  if (sending) return;

  const previousVote = myVote;

  setSending(true);
  setError("");

  try {
    const result = await api<VoteResult>(`/projects/${projectId}/vote`, {
      method: "POST",
      body: { choice },
      token: user.token,
    });

    setVotes(result.votes);
    setMyVote(result.myVote);

    if (previousVote === result.myVote) {
      showToast(
        `Your ${choice} vote is recorded.`,
        "success",
      );
    } else if (previousVote !== null) {
      showToast(
        `Your vote has been changed to ${result.myVote}.`,
        "success",
      );
    } else {
      showToast(
        `Your ${result.myVote} vote has been recorded.`,
        "success",
      );
    }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Something went wrong.";

    setError(message);
    showToast(message, "error");
  } finally {
    setSending(false);
  }
};

  return { votes, myVote, sending, error, vote };
};
