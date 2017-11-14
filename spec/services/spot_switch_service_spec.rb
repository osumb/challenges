require 'rails_helper'

describe SpotSwitchService do
  describe '.queue_switches' do
    let(:performance) { create(:performance) }
    let(:challenges) do
      [
        create(:tri_challenge, performance: performance, stage: :done),
        create(:normal_challenge, performance: performance, stage: :done)
      ]
    end

    it 'queues up jobs' do
      expect(SwitchSpotForChallengeJob).to receive(:perform_later)
        .with(challenge_id: challenges.first.id)
        .and_return(true)
      expect(SwitchSpotForChallengeJob).to receive(:perform_later)
        .with(challenge_id: challenges.last.id)
        .and_return(true)

      described_class.queue_switches(performance_id: performance.id)
    end
  end

  describe '.switch_spots_for_challenge' do
    context 'Normal Challenge' do
      let!(:challenge) { create(:normal_challenge, stage: :done) }
      let!(:winner) { challenge.users.select(&:alternate?).first }
      let!(:loser) { challenge.users.reject(&:alternate?).first }
      let!(:spot_for_loser) { winner.current_spot }

      before do
        challenge.user_challenges.each do |uc|
          if uc.user.alternate?
            uc.update(place: UserChallenge.places[:first])
          else
            uc.update(place: UserChallenge.places[:second])
          end
        end
      end

      it 'switches spots such that the winner has the challenge spot' do
        described_class.switch_spots_for_challenge(challenge_id: challenge.id)

        winner.reload
        loser.reload
        expect(winner.current_spot).to eq(challenge.spot)
        expect(loser.current_spot).to eq(spot_for_loser)
      end
    end

    context 'Open Spot Challenge' do
      context 'user of open spot is not challenging' do
        let!(:challenge) { create(:full_open_spot_challenge, stage: :done) }
        let!(:winner) { challenge.users.first }
        let!(:loser) { challenge.users.last }
        let!(:user_of_challenge_spot) { create(:user, current_spot: challenge.spot) }
        let!(:spot_for_winner) { challenge.spot }
        let!(:spot_for_loser) { loser.current_spot }
        let!(:spot_for_user_of_challenge_spot) { winner.current_spot }

        before do
          challenge.user_challenges.each_with_index do |uc, index|
            uc.update(place: index + 1)
          end
        end

        it 'switches the users appropriately' do
          described_class.switch_spots_for_challenge(challenge_id: challenge.id)

          winner.reload
          loser.reload
          user_of_challenge_spot.reload
          expect(winner.current_spot).to eq(spot_for_winner)
          expect(loser.current_spot).to eq(spot_for_loser)
          expect(user_of_challenge_spot.current_spot).to eq(spot_for_user_of_challenge_spot)
        end
      end

      context 'user of open spot is challenging' do
        let!(:open_spot_challenge) { create(:full_open_spot_challenge, stage: :done) }
        let!(:normal_challenge_spot) { create(:spot, row: :a, file: 11) }
        let!(:open_spot_winner) { open_spot_challenge.users.first }
        let!(:open_spot_loser) { open_spot_challenge.users.last }
        let!(:user_of_open_challenge_spot) { create(:user, current_spot: open_spot_challenge.spot) }
        let!(:user_of_normal_challenge_spot) { create(:user, current_spot: normal_challenge_spot) }
        let!(:spot_for_open_spot_winner) { open_spot_challenge.spot }
        let!(:spot_for_open_spot_loser) { open_spot_loser.current_spot }
        let!(:normal_challenge) do
          challenge = Challenge::Bylder.perform(user_of_open_challenge_spot, open_spot_challenge.performance, normal_challenge_spot)
          challenge.update(stage: :done)
          challenge
        end

        context 'and that user loses' do
          let!(:spot_for_normal_winner) { normal_challenge_spot }
          let!(:spot_for_normal_loser) { open_spot_winner.current_spot }

          before do
            open_spot_challenge.user_challenges.each_with_index do |uc, index|
              uc.update(place: index + 1)
            end
            normal_challenge.user_challenges.each do |uc|
              # Make sure user who owned open spot loses
              if uc.user == user_of_open_challenge_spot
                uc.update(place: UserChallenge.places[:second])
              else
                uc.update(place: UserChallenge.places[:first])
              end
            end
          end

          it 'switches the spots appropriately' do
            described_class.switch_spots_for_challenge(challenge_id: open_spot_challenge.id)

            open_spot_winner.reload
            open_spot_loser.reload
            user_of_open_challenge_spot.reload
            user_of_normal_challenge_spot.reload

            expect(open_spot_winner.current_spot).to eq(spot_for_open_spot_winner)
            expect(open_spot_loser.current_spot).to eq(spot_for_open_spot_loser)
            expect(user_of_open_challenge_spot.current_spot).to eq(spot_for_normal_loser)
            expect(user_of_normal_challenge_spot.current_spot).to eq(spot_for_normal_winner)
          end
        end

        context 'and that user wins' do
          let!(:spot_for_normal_winner) { open_spot_winner.current_spot }
          let!(:spot_for_normal_loser) { normal_challenge_spot }

          before do
            open_spot_challenge.user_challenges.each_with_index do |uc, index|
              uc.update(place: index + 1)
            end
            normal_challenge.user_challenges.each do |uc|
              # Make sure user who owned open spot wins
              if uc.user != user_of_open_challenge_spot
                uc.update(place: UserChallenge.places[:second])
              else
                uc.update(place: UserChallenge.places[:first])
              end
            end
          end

          it 'switches the spots appropriately' do
            described_class.switch_spots_for_challenge(challenge_id: open_spot_challenge.id)
            described_class.switch_spots_for_challenge(challenge_id: normal_challenge.id)

            open_spot_winner.reload
            open_spot_loser.reload
            user_of_open_challenge_spot.reload
            user_of_normal_challenge_spot.reload

            expect(open_spot_winner.current_spot).to eq(spot_for_open_spot_winner)
            expect(open_spot_loser.current_spot).to eq(spot_for_open_spot_loser)
            expect(user_of_open_challenge_spot.current_spot).to eq(spot_for_normal_loser)
            expect(user_of_normal_challenge_spot.current_spot).to eq(spot_for_normal_winner)
          end
        end
      end
    end

    context 'Tri Challenge' do
      let(:challenge) { create(:tri_challenge, stage: :done) }

      context 'the challenge places are in the order the members are already alternates' do
        let(:first_place) { challenge.users.reject(&:alternate?).first }
        let(:second_place) { challenge.users.sort { |a, b| a.current_spot.file - b.current_spot.file }.select(&:alternate?).first }
        let(:third_place) { challenge.users.select { |u| u != first_place && u != second_place }.first }
        let(:first_place_spot) { first_place.current_spot }
        let(:second_place_spot) { second_place.current_spot }
        let(:third_place_spot) { third_place.current_spot }

        before do
          challenge.user_challenges.each_with_index do |uc, index|
            uc.update(place: index + 1)
          end
        end

        it 'doesn\'t switch the spots at all' do
          described_class.switch_spots_for_challenge(challenge_id: challenge.id)

          first_place.reload
          second_place.reload
          third_place.reload

          expect(first_place.current_spot).to eq(first_place_spot)
          expect(second_place.current_spot).to eq(second_place_spot)
          expect(third_place.current_spot).to eq(third_place_spot)
        end
      end

      context 'the regular wins, but the alternate with the higher spot wins' do
        let!(:first_place) { challenge.users.reject(&:alternate?).first }
        let!(:second_place) { challenge.users.sort { |a, b| a.current_spot.file - b.current_spot.file }.select(&:alternate?).last }
        let!(:third_place) { challenge.users.select { |u| u != first_place && u != second_place }.first }
        let!(:first_place_spot) { first_place.current_spot }
        # second and third place should switch spots
        let!(:second_place_spot) { third_place.current_spot }
        let!(:third_place_spot) { second_place.current_spot }

        before do
          challenge.user_challenges.each do |uc|
            if uc.user == first_place
              uc.update(place: 1)
            elsif uc.user == second_place
              uc.update(place: 2)
            else
              uc.update(place: 3)
            end
          end
        end

        it 'switches the two alternate spots' do
          described_class.switch_spots_for_challenge(challenge_id: challenge.id)

          first_place.reload
          second_place.reload
          third_place.reload

          expect(first_place.current_spot).to eq(first_place_spot)
          expect(second_place.current_spot).to eq(second_place_spot)
          expect(third_place.current_spot).to eq(third_place_spot)
        end
      end

      context 'the lowest alternate wins and the regular comes in 3rd place' do
        let!(:first_place) { challenge.users.sort { |a, b| a.current_spot.file - b.current_spot.file }.select(&:alternate?).last }
        let!(:second_place) { challenge.users.sort { |a, b| a.current_spot.file - b.current_spot.file }.select(&:alternate?).first }
        let!(:third_place) { challenge.users.reject(&:alternate?).first }
        # first and third place should switch spots
        let!(:first_place_spot) { third_place.current_spot }
        let!(:second_place_spot) { second_place.current_spot }
        let!(:third_place_spot) { first_place.current_spot }

        before do
          challenge.user_challenges.each do |uc|
            if uc.user == first_place
              uc.update(place: 1)
            elsif uc.user == second_place
              uc.update(place: 2)
            else
              uc.update(place: 3)
            end
          end
        end

        it 'switches the regular and last alternate' do
          described_class.switch_spots_for_challenge(challenge_id: challenge.id)

          first_place.reload
          second_place.reload
          third_place.reload

          expect(first_place.current_spot).to eq(first_place_spot)
          expect(second_place.current_spot).to eq(second_place_spot)
          expect(third_place.current_spot).to eq(third_place_spot)
        end
      end

      context 'the lowest alternate wins and the regular comes in second' do
        let!(:first_place) { challenge.users.sort { |a, b| a.current_spot.file - b.current_spot.file }.select(&:alternate?).last }
        let!(:second_place) { challenge.users.reject(&:alternate?).first }
        let!(:third_place) { challenge.users.sort { |a, b| a.current_spot.file - b.current_spot.file }.select(&:alternate?).first }
        # first and third place should switch spots
        let!(:first_place_spot) { second_place.current_spot }
        let!(:second_place_spot) { third_place.current_spot }
        let!(:third_place_spot) { first_place.current_spot }

        before do
          challenge.user_challenges.each do |uc|
            if uc.user == first_place
              uc.update(place: 1)
            elsif uc.user == second_place
              uc.update(place: 2)
            else
              uc.update(place: 3)
            end
          end
        end

        it 'switches everyone' do
          described_class.switch_spots_for_challenge(challenge_id: challenge.id)

          first_place.reload
          second_place.reload
          third_place.reload

          expect(first_place.current_spot).to eq(first_place_spot)
          expect(second_place.current_spot).to eq(second_place_spot)
          expect(third_place.current_spot).to eq(third_place_spot)
        end
      end
    end
  end
end
