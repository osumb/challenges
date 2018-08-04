require "rails_helper"

describe UserChallenge, type: :model do
  let(:challenge) { create(:normal_challenge) }
  describe "#can_user_remove_self_from_challenge?" do
    context "when the challenge is normal" do
      it "lets the challenger leave the challenge" do
        challenger = challenge.users.select(&:alternate?).first
        expect(
          described_class.can_user_remove_self_from_challenge?(challenger, challenge, challenger.user_challenges.first)
        ).to be(true)
      end

      it "does not let the challengee leave the challenge" do
        challengee = challenge.users.reject(&:alternate?).first
        expect(
          described_class.can_user_remove_self_from_challenge?(challengee, challenge, challengee.user_challenges.first)
        ).to be(false)
      end
    end
  end
end
