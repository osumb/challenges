require 'rails_helper'

describe ChallengeOptionsService do
  describe '.find_for_user' do
    let(:user) { create(:alternate_user, :trumpet, :solo, :spot_a13) }

    context 'when there is no upcoming performance' do
      it 'returns an empty list of challenge_options' do
        result = described_class.find_for_user(user: user)

        expect(result.challenge_options).to be_empty
      end

      it 'returns a nil next performance' do
        result = described_class.find_for_user(user: user)

        expect(result.next_performance).to be_nil
      end
    end

    context 'when the next performance\'s window isn\'t open' do
      let!(:performance) { create(:performance, window_open: 2.days.from_now) }

      it 'returns an empty list of challenge_options' do
        result = described_class.find_for_user(user: user)

        expect(result.challenge_options).to be_empty
      end

      it 'returns the next performance' do
        result = described_class.find_for_user(user: user)

        expect(result.next_performance).to eq(performance)
      end
    end

    context 'when the user has a discipline action that makes them ineligible to challenge' do
      let(:user) { create(:user) }
      let(:performance) { create(:performance) }
      let!(:discipline_action) { create(:discipline_action, user: user, performance: performance) }

      it 'returns an empty list of challenge_options' do
        result = described_class.find_for_user(user: user)

        expect(result.challenge_options).to be_empty
      end

      it 'returns the next performance' do
        result = described_class.find_for_user(user: user)

        expect(result.next_performance).to eq(performance)
      end
    end

    context 'when the user isn\'t an alternate' do
      context 'and the user has a discipline action that allows them to challenge' do
        let(:user) { create(:user) }
        let(:performance) { create(:performance) }
        let!(:discipline_action) { create(:discipline_action, user: user, performance: performance, allowed_to_challenge: true) }
        let!(:challengeable_user) do
          create(
            :user,
            instrument: user.instrument,
            part: user.part,
            current_spot: Spot.new(row: user.current_spot.row, file: user.current_spot.file + 1)
          )
        end

        it 'returns a list of challenge_options', :aggregate_failures do
          result = described_class.find_for_user(user: user)

          expect(result.challenge_options.length).to eq(1)
          expect(result.challenge_options.first[:buck_id]).to eq(challengeable_user.buck_id)
        end
      end
    end

    context 'when there are multiple users' do
      let(:user) { create(:alternate_user) }
      let!(:performance) { create(:performance) }
      let!(:challengeable_user_1) do
        create(
          :user,
          instrument: user.instrument,
          part: user.part,
          current_spot: Spot.new(row: user.current_spot.row, file: 2)
        )
      end
      let!(:challengeable_user_2) do
        create(
          :user,
          instrument: user.instrument,
          part: user.part,
          current_spot: Spot.new(row: user.current_spot.row, file: 1)
        )
      end

      context 'but one of the users has already been challenged' do
        before(:each) do
          user_who_already_challenged = create(
            :alternate_user,
            instrument: user.instrument,
            current_spot: Spot.new(row: user.current_spot.row, file: 14)
          )
          Challenge::Bylder.perform(user_who_already_challenged, performance, challengeable_user_2.current_spot).save
        end

        it 'reports the fact that challengeable_user_2 has been challegned', :aggregate_failures do
          result = described_class.find_for_user(user: user)

          user_2_result = result.challenge_options.select { |u| u[:buck_id] == challengeable_user_2.buck_id }.first

          expect(user_2_result[:members_in_challenge]).to eq(2)
          expect(user_2_result[:challenge_type]).to eq(Challenge.challenge_types['normal'])
        end
      end

      it 'returns a list of challenge_options', :aggregate_failures do
        result = described_class.find_for_user(user: user)

        sorted_result_buck_ids = result.challenge_options.map { |u| u[:buck_id] }.sort
        sorted_expected_buck_ids = [challengeable_user_1.buck_id, challengeable_user_2.buck_id].sort
        expect(result.challenge_options.length).to eq(2)
        expect(sorted_result_buck_ids).to eq(sorted_expected_buck_ids)
      end

      it 'returns a list of options sorted by spot row/file', :aggregate_failures do
        result = described_class.find_for_user(user: user)

        sorted_spots = [challengeable_user_1.current_spot, challengeable_user_2.current_spot].sort.map(&:to_s)
        received_spots = result.challenge_options.map { |option| "#{Spot.get_row_from_database_value(option[:row]).upcase}#{option[:file]}" }

        expect(received_spots).to eq(sorted_spots)
      end
    end
  end
end
