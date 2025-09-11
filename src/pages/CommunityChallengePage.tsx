// src/pages/CommunityChallengePage.tsx
import { useEffect, useState } from "react";
import { getAllChallenges } from "../services/communityChallengeService";
import ChallengeCard from "../components/ChallengeCard";
// import ShareChallengeForm from "../components/ShareChallengeForm";
import type { Challenge } from "../types";
import SocialMediaPostInput from "../components/SocialMediaPostInput";

const CommunityChallengePage = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const data = await getAllChallenges();
      setChallenges(data);
    } catch (error) {
      console.error("Error fetching challenges:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-4">🔥 Share a Challenge</h1>

      {/* Share form giống post status */}
      <SocialMediaPostInput />

      <h2 className="text-xl font-semibold mt-8 mb-4">
        📃 All Community Challenges
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : challenges.length > 0 ? (
        <div className="grid gap-4">
          {challenges.map((challenge) => (
            <ChallengeCard key={challenge._id} data={challenge} />
          ))}
        </div>
      ) : (
        <div className="text-gray-600 text-center py-6">
          <p className="text-lg font-medium mb-2">
            Chưa có challenge nào được chia sẻ.
          </p>
          <p className="text-sm">
            Hãy là người đầu tiên chia sẻ một thử thách cho cộng đồng!
          </p>
        </div>
      )}
    </div>
  );
};

export default CommunityChallengePage;
