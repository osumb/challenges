require 'rails_helper'

describe 'Challenge Approval', type: :request do
  let(:user) { create(:admin_user) }
  let(:challenge) { create(:normal_challenge) }
  let(:non_admin_user) { create(:user) }

  describe 'PUT /api/challenges/approve' do
    let(:endpoint) { "/api/challenges/#{challenge.id}/approve" }

    before do
      challenge.user_challenges.each_with_index do |uc, index|
        uc.update(place: index + 1)
      end
    end

    it 'prevents a non admin user from approving a challenge' do
      put endpoint, headers: authenticated_header(non_admin_user)

      expect(response).to have_http_status(:forbidden)
    end

    it 'changes the challenge\'s stage to :done' do
      put endpoint, headers: authenticated_header(user)

      expect(response).to have_http_status(:no_content)
      expect(challenge.reload.stage).to eq(:done.to_s)
    end

    context 'switching spots' do
      before do
        challenge.user_challenges.each do |uc|
          user = uc.user
          if user.alternate?
            uc.update(place: UserChallenge.places[:first])
          else
            uc.update(place: UserChallenge.places[:second])
          end
        end
      end

      it 'calls the job' do
        expect(CheckChallengesDoneJob).to receive(:perform_later).with(performance_id: challenge.performance.id).and_return(true)
        put endpoint, headers: authenticated_header(user)
      end
    end
  end

  describe 'PUT /api/challenges/disapprove' do
    let(:endpoint) { "/api/challenges/#{challenge.id}/disapprove" }

    context 'the challenge is in :needs_approval stage' do
      let(:challenge) { create(:normal_challenge) }

      before do
        challenge.user_challenges.each_with_index do |uc, index|
          uc.update(place: index + 1)
        end
        challenge.update(stage: :needs_approval)
      end

      it 'changes the challenge to :needs_comments' do
        put endpoint, headers: authenticated_header(user)

        expect(response).to have_http_status(:no_content)
        expect(challenge.reload.stage).to eq(:needs_comments.to_s)
      end
    end

    context 'the challenge isn\'t in :needs_comments' do
      let(:challenge) { create(:normal_challenge, stage: :done) }

      before do
        challenge.user_challenges.each_with_index do |uc, index|
          uc.update(place: index + 1)
        end
      end

      it 'does not change the challenge\'s stage to :needs_comments' do
        put endpoint, headers: authenticated_header(user)

        expect(response).to have_http_status(:conflict)
        expect(challenge.reload.stage).to eq(:done.to_s)
      end
    end
  end
end
