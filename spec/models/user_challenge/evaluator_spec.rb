require 'rails_helper'

describe UserChallenge::Evaluator, type: :model do
  subject(:evaluator) { UserChallenge::Evaluator.new(params: params) }
  let(:params) { ActionController::Parameters.new(user_challenges: user_challenges) }
  let(:challenge) { create(:normal_challenge) }
  let(:user_challenge_1) { challenge.user_challenges.first }
  let(:user_challenge_2) { challenge.user_challenges.last }

  describe '#save_comments' do
    let(:comments_1) { 'User 1 did some things.' }
    let(:comments_2) { 'User 2 did some other things.' }
    let(:user_challenges) do
      [
        {
          id: user_challenge_1.id,
          comments: comments_1
        },
        {
          id: user_challenge_2.id,
          comments: comments_2
        }
      ]
    end

    context 'when one update fails' do
      let(:failing_user_challenge) { instance_double(UserChallenge, id: user_challenge_1.id) }

      before do
        allow(failing_user_challenge).to receive(:update!).and_raise(StandardError)
        allow(failing_user_challenge).to receive(:errors).and_return(['uh oh'])
        allow(UserChallenge).to receive(:where).and_return([failing_user_challenge, user_challenge_2])
      end

      it 'does not update the other user challenges' do
        expect { evaluator.save_comments }.not_to change { user_challenge_2.reload.comments }
      end

      it 'returns a failure' do
        expect(evaluator.save_comments.failure?).to be(true)
      end
    end

    context 'when the updates are successful' do
      it 'saves the corrent comments for the user challenges' do
        evaluator.save_comments

        expect(user_challenge_1.reload.comments).to eq(comments_1)
        expect(user_challenge_2.reload.comments).to eq(comments_2)
      end

      it 'returns a success' do
        expect(evaluator.save_comments.success?).to be(true)
      end
    end
  end

  describe '#save_places' do
    let(:place_1) { 1 }
    let(:place_2) { 2 }
    let(:user_challenges) do
      [
        {
          id: user_challenge_1.id,
          place: place_1
        },
        {
          id: user_challenge_2.id,
          place: place_2
        }
      ]
    end

    context 'when one update fails' do
      let(:failing_user_challenge) { instance_double(UserChallenge, id: user_challenge_1.id) }

      before do
        allow(failing_user_challenge).to receive(:update!).and_raise(StandardError)
        allow(failing_user_challenge).to receive(:errors).and_return(['uh oh'])
        allow(UserChallenge).to receive(:where).and_return([failing_user_challenge, user_challenge_2])
      end

      it 'does not update the other user challenges' do
        expect { evaluator.save_places }.not_to change { user_challenge_2.reload.place }
      end

      it 'returns a failure' do
        expect(evaluator.save_places.failure?).to be(true)
      end
    end

    context 'when the updates are successful' do
      it 'saves the corrent comments for the user challenges' do
        evaluator.save_places

        expect(UserChallenge.places[user_challenge_1.reload.place]).to eq(place_1)
        expect(UserChallenge.places[user_challenge_2.reload.place]).to eq(place_2)
      end

      it 'returns a success' do
        expect(evaluator.save_places.success?).to be(true)
      end
    end
  end
end
