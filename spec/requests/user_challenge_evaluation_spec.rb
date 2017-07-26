require 'rails_helper'

describe 'User Challenges Evaluation', type: :request do
  subject(:request) { post endpoint, params: params.to_json, headers: authenticated_header(admin) }
  let(:admin) { create(:admin) }
  let(:challenge) { create(:normal_challenge) }
  let(:user_challenge_1) { challenge.user_challenges.first }
  let(:user_challenge_2) { challenge.user_challenges.last }
  let(:params) { { user_challenges: user_challenge_params } }

  describe 'POST /api/user_challenges/comments' do
    let(:endpoint) { '/api/user_challenges/comments' }
    let(:comments_1) { 'User 1 did some things.' }
    let(:comments_2) { 'User 2 did some other things.' }
    let(:user_challenge_params) do
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

    context 'when the user can evaluate' do
      before do
        allow(challenge).to receive(:can_be_evaluated_by).and_return(true)
      end

      specify { expect { request }.to have_http_status(:no_content) }

      it 'updates the user challenges' do
        request

        expect(user_challenge_1.reload.comments).to eq(comments_1)
        expect(user_challenge_2.reload.comments).to eq(comments_2)
      end
    end

    context 'when the user cannot evaluate' do
      before do
        allow(challenge).to receive(:can_be_evaluated_by).and_return(false)
      end

      specify { expect { request }.to have_http_status(:unauthorized) }

      it 'does not update the user challenges' do
        request

        expect(user_challenge_1.reload.comments).to be_nil
        expect(user_challenge_2.reload.comments).to be_nil
      end
    end
  end

  describe 'POST /api/user_challenges/places' do
    let(:endpoint) { '/api/user_challenges/places' }
    let(:place_1) { 1 }
    let(:place_2) { 2 }
    let(:user_challenge_params) do
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

    context 'when the user can evaluate' do
      before do
        allow(challenge).to receive(:can_be_evaluated_by).and_return(true)
      end

      specify { expect { request }.to have_http_status(:no_content) }

      it 'updates the user challenges' do
        request

        expect(UserChallenge.places[user_challenge_1.reload.place]).to eq(place_1)
        expect(UserChallenge.places[user_challenge_2.reload.place]).to eq(place_2)
      end
    end

    context 'when the user cannot evaluate' do
      before do
        allow(challenge).to receive(:can_be_evaluated_by).and_return(false)
      end

      specify { expect { request }.to have_http_status(:no_content) }

      it 'updates the user challenges' do
        request

        expect(user_challenge_1.reload.place).to be_nil
        expect(user_challenge_2.reload.place).to be_nil
      end
    end
  end
end
