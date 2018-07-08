require 'rails_helper'

describe ChallengeService do
  describe '.check_other_challenges_are_done' do
    context 'one challenge' do
      let!(:challenge) { create(:normal_challenge, stage: stage) }

      context 'in the done stage' do
        let(:stage) { :done }

        it 'calls the spot switch job' do
          expect(SwitchSpotForChallengeJob).to receive(:perform_later)
            .with(challenge_id: challenge.id)
            .and_return(true)

          described_class.check_other_challenges_are_done(challenge_id: challenge.id)
        end
      end

      context 'not in the done stage' do
        let(:stage) { :needs_comments }

        it 'doesn\'t call the spot switch job' do
          expect(SwitchSpotForChallengeJob).not_to receive(:perform_later)

          described_class.check_other_challenges_are_done(challenge_id: challenge.id)
        end
      end
    end

    context 'multiple challenges' do
      context 'with users with different spots' do
        let!(:challenge_to_switch) { create(:normal_challenge, stage: :done) }
        let!(:challenge_not_to_switch) { create(:tri_challenge, stage: :done) }

        it 'doesn\'t switch the wrong challenge' do
          expect(SwitchSpotForChallengeJob).not_to receive(:perform_later)
            .with(challenge_id: challenge_not_to_switch.id)
          expect(SwitchSpotForChallengeJob).to receive(:perform_later)
            .with(challenge_id: challenge_to_switch.id)

          described_class.check_other_challenges_are_done(challenge_id: challenge_to_switch.id)
        end
      end

      context 'with users with the same instruments and parts and done stage' do
        let(:challenges) do
          performance = create(:performance)
          first_challenge_users = [
            create(:user, :spot_a1, :trumpet, :solo),
            create(:user, :spot_a13, :trumpet, :solo)
          ]
          first_challenge_spot = first_challenge_users.first.current_spot
          second_challenge_users = [
            create(:user, :spot_x1, :trumpet, :solo),
            create(:user, :spot_x13, :trumpet, :solo)
          ]
          second_challenge_spot = second_challenge_users.first.current_spot
          [
            create(:normal_challenge, users: first_challenge_users, spot: first_challenge_spot, performance: performance, stage: :done),
            create(:normal_challenge, users: second_challenge_users, spot: second_challenge_spot, performance: performance, stage: :done)
          ]
        end

        it 'calls the spot switch for all challenges' do
          expect(SwitchSpotForChallengeJob).to receive(:perform_later)
            .with(challenge_id: challenges.first.id)
          expect(SwitchSpotForChallengeJob).to receive(:perform_later)
            .with(challenge_id: challenges.last.id)

          described_class.check_other_challenges_are_done(challenge_id: challenges.first.id)
        end
      end

      context 'with users with the same instruments and different parts and done stage' do
        let(:challenges) do
          performance = create(:performance)
          first_challenge_users = [
            create(:user, :spot_a1, :trumpet, :solo),
            create(:user, :spot_a13, :trumpet, :solo)
          ]
          first_challenge_spot = first_challenge_users.first.current_spot
          second_challenge_users = [
            create(:user, :spot_x1, :trumpet, :efer),
            create(:user, :spot_x13, :trumpet, :efer)
          ]
          second_challenge_spot = second_challenge_users.first.current_spot
          [
            create(:normal_challenge, users: first_challenge_users, spot: first_challenge_spot, performance: performance, stage: :done),
            create(:normal_challenge, users: second_challenge_users, spot: second_challenge_spot, performance: performance, stage: :done)
          ]
        end

        it 'calls the spot switch for all challenges' do
          expect(SwitchSpotForChallengeJob).to receive(:perform_later)
            .with(challenge_id: challenges.first.id)
          expect(SwitchSpotForChallengeJob).not_to receive(:perform_later)
            .with(challenge_id: challenges.last.id)

          described_class.check_other_challenges_are_done(challenge_id: challenges.first.id)
        end
      end

      context 'with users with the same instruments and parts, but not all in done stage' do
        let(:challenges) do
          performance = create(:performance)
          first_challenge_users = [
            create(:user, :spot_a1, :trumpet, :solo),
            create(:user, :spot_a13, :trumpet, :solo)
          ]
          first_challenge_spot = first_challenge_users.first.current_spot
          second_challenge_users = [
            create(:user, :spot_x1, :trumpet, :solo),
            create(:user, :spot_x13, :trumpet, :solo)
          ]
          second_challenge_spot = second_challenge_users.first.current_spot
          [
            create(:normal_challenge, users: first_challenge_users, spot: first_challenge_spot, performance: performance, stage: :done),
            create(:normal_challenge, users: second_challenge_users, spot: second_challenge_spot, performance: performance, stage: :needs_comments)
          ]
        end

        it 'calls the spot switch for all challenges' do
          expect(SwitchSpotForChallengeJob).not_to receive(:perform_later)
            .with(challenge_id: challenges.first.id)
          expect(SwitchSpotForChallengeJob).not_to receive(:perform_later)
            .with(challenge_id: challenges.last.id)

          described_class.check_other_challenges_are_done(challenge_id: challenges.first.id)
        end
      end
    end
  end

  describe '.remove_user_from_challenge' do
    context 'open spot challenge' do
      context 'that is full' do
        let(:challenge) { create(:full_open_spot_challenge) }
        let!(:user_challenge) { challenge.user_challenges.first }

        it 'destroys the user challenge' do
          expect do
            described_class.remove_user_from_challenge(
              challenge_id: challenge.id,
              user_buck_id: user_challenge.user_buck_id
            )
          end.to change { UserChallenge.count }
        end

        it 'doesn\'t destroy the associated challenge' do
          expect do
            described_class.remove_user_from_challenge(
              challenge_id: challenge.id,
              user_buck_id: user_challenge.user_buck_id
            )
          end.not_to change { Challenge.count }
        end

        it 'returns a success' do
          result = described_class.remove_user_from_challenge(
            challenge_id: challenge.id,
            user_buck_id: user_challenge.user_buck_id
          )

          expect(result.success?).to be(true)
        end
      end

      context 'that isn\'t full' do
        let(:challenge) { create(:open_spot_challenge) }
        let!(:user_challenge) { challenge.user_challenges.first }

        it 'destroys the user challenge' do
          expect do
            described_class.remove_user_from_challenge(
              challenge_id: challenge.id,
              user_buck_id: user_challenge.user_buck_id
            )
          end.to change { UserChallenge.count }.by(-1)
        end

        it 'destroys the associated challenge' do
          expect do
            described_class.remove_user_from_challenge(
              challenge_id: challenge.id,
              user_buck_id: user_challenge.user_buck_id
            )
          end.to change { Challenge.count }.by(-1)
        end

        it 'returns a success' do
          result = described_class.remove_user_from_challenge(
            challenge_id: challenge.id,
            user_buck_id: user_challenge.user_buck_id
          )

          expect(result.success?).to be(true)
        end
      end
    end

    context 'non open spot challenge' do
      let(:challenge) { create(:normal_challenge) }
      let!(:user_challenge) { challenge.user_challenges.first }

      it 'destroys all user challenges' do
        expect do
          described_class.remove_user_from_challenge(
            challenge_id: challenge.id,
            user_buck_id: user_challenge.user_buck_id
          )
        end.to change { UserChallenge.count }.by(-2)
      end

      it 'destroys the associated challenge' do
        expect do
          described_class.remove_user_from_challenge(
            challenge_id: challenge.id,
            user_buck_id: user_challenge.user_buck_id
          )
        end.to change { Challenge.count }.by(-1)
      end

      it 'returns a success' do
        result = described_class.remove_user_from_challenge(
          challenge_id: challenge.id,
          user_buck_id: user_challenge.user_buck_id
        )

        expect(result.success?).to be(true)
      end
    end
  end

  describe '.move_to_next_stage' do
    let(:stage) { :needs_comments }
    subject(:challenge) { create(:normal_challenge, stage: stage) }

    context 'when the challenge is in the :needs_comments stage' do
      it 'moves the challenge to :done' do
        described_class.move_to_next_stage(challenge_id: challenge.id)

        expect(challenge.reload.done_stage?).to be(true)
      end
    end

    context 'when the challenge is in the :done stage' do
      let(:stage) { :done }

      it 'raises an exception because :done is the last stage' do
        expect do
          described_class.move_to_next_stage(challenge_id: challenge.id)
        end.to raise_error(described_class::ChallengeAlreadyDoneError)
      end
    end
  end
end
