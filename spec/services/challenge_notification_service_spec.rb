require "rails_helper"

describe ChallengeNotificationService do
  describe ".notify_challengers_of_completion" do
    let(:challenge) { create(:normal_challenge, stage: stage) }
    let(:stage) { :done }

    context "when called from the job" do
      let(:job) { NotifyChallengeCompletionJob }

      before { allow(described_class).to receive(:notify_challengers_of_completion).and_call_original }

      it "works" do
        job.perform_now(challenge_id: challenge.id)

        expect(described_class).to have_received(:notify_challengers_of_completion).with(challenge_id: challenge.id)
      end
    end

    context "when the challenge is not done" do
      let(:stage) { :needs_comments }

      it "raises" do
        expect do
          described_class.notify_challengers_of_completion(challenge_id: challenge.id)
        end.to raise_error(described_class::ChallengeNotDoneError)
      end
    end

    context "when the challenge is done" do
      let(:stage) { :done }
      let(:users) { challenge.users }

      before { allow(EmailJob).to receive(:perform_later).and_call_original }

      it "emails the users of the challenge", :aggregate_failures do
        described_class.notify_challengers_of_completion(challenge_id: challenge.id)

        expect(users).not_to be_empty
        users.each do |user|
          expect(EmailJob).to have_received(:perform_later).with(
            klass: "ChallengeResultMailer",
            method: "completed_email",
            args: {
              performance_id: challenge.performance_id,
              email: user.email
            }
          )
        end
      end
    end
  end
end
