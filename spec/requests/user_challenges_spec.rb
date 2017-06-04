require 'rails_helper'

# The purpose of this file is to test the following controller actions associated with UserChallenge objects:
#   Create - if a UserChallenge is created with an associated open spot challenge and conditions are valid, the user
#            be added
#   Delete - if a UserChallenge is deleted, test for whether the associated challenge should be deleted

describe 'User Challenges', type: :request do
  let(:endpoint) { '/api/user_challenges/' }
  let(:admin) { create(:admin_user) }

  describe 'POST /api/user_challenges' do
    context 'on an open spot challenge' do
      let!(:challenge) { create(:open_spot_challenge) }
      let(:performance) { challenge.performance }
      let(:challenger) { challenge.users.first }
      let(:new_challenger) {
        create(
          :alternate_user,
          "spot_#{challenger.spot.row}#{challenger.spot.file + 1}".to_sym,
          challenger.instrument.to_sym,
          challenger.part.to_sym
        )
      }

      context 'and the requesting user is an admin' do
        let(:params) do
          {
            challenger_buck_id: new_challenger.buck_id,
            challenge_id: challenge.id
          }
        end

        it 'successfully adds the new user to the challenge' do
          expect {
            post endpoint, params: params.to_json, headers: authenticated_header(admin)
          }.to change { challenge.reload.users.count }.by(1)

          expect(challenge.users).to include(new_challenger)
        end

        context 'but the challenge is already full' do
          let!(:challenge) { create(:full_open_spot_challenge) }
          let(:new_challenger) {
            instrument = challenge.users.first.instrument.to_sym
            part = challenge.users.first.part.to_sym
            create(:alternate_user, :spot_x13, instrument, part)
          }

          it 'returns a 403' do
            expect {
              post endpoint, params: params.to_json, headers: authenticated_header(admin)
            }.not_to change { UserChallenge.count }

            expect(response).to have_http_status(403)
            expect(JSON.parse(response.body)['errors'].join).to include('challenge is already full')
          end
        end
      end

      context 'and the requesting user is not an admin' do
        let(:params) do
          { challenge_id: challenge.id }
        end

        it 'successfully adds the new challenge to the challenge' do
          expect {
            post endpoint, params: params.to_json, headers: authenticated_header(new_challenger)
          }.to change { challenge.reload.users.count }.by(1)

          expect(challenge.users).to include(new_challenger)
        end

        context 'but the challenge is already full' do
          let!(:challenge) { create(:full_open_spot_challenge) }
          let(:new_challenger) {
            instrument = challenge.users.first.instrument.to_sym
            part = challenge.users.first.part.to_sym
            create(:alternate_user, :spot_x13, instrument, part)
          }

          it 'returns a 403' do
            expect {
              post endpoint, params: params.to_json, headers: authenticated_header(new_challenger)
            }.not_to change { UserChallenge.count }

            expect(response).to have_http_status(403)
            expect(JSON.parse(response.body)['errors'].join).to include('challenge is already full')
          end
        end
      end
    end
  end

  describe 'DELETE /api/user_challenges' do
    context 'on a normal challenge' do
      let!(:challenge) { create(:normal_challenge) }
      let(:performance) { challenge.performance }
      let(:challenger) { challenge.users.select(&:alternate?).first }
      let(:challengee) { challenge.users.reject(&:alternate?).first }

      context 'and the request isn\'t made by an admin' do
        it 'destroys the challenge when the user leaves' do
          user_challenge_id = challenger.user_challenges.first.id
          expect {
            delete "#{endpoint}#{user_challenge_id}", headers: authenticated_header(challenger)
          }.to change { Challenge.count }.by(-1)

          expect(response).to have_http_status(204)
          expect(challenger.challenges.count).to be_zero
          expect(challengee.challenges.count).to be_zero
        end

        it 'returns a 403 when the challengee tries to leave the challenge' do
          user_challenge_id = challengee.user_challenges.first.id
          expect {
            delete "#{endpoint}#{user_challenge_id}", headers: authenticated_header(challengee)
          }.not_to change { Challenge.count }

          expect(response).to have_http_status(403)
        end
      end

      context 'and the request is made by an admin' do
        it 'destroys the challenge when the challenger\'s user_challenge is deleted' do
          user_challenge_id = challenger.user_challenges.first.id
          expect {
            delete "#{endpoint}#{user_challenge_id}", headers: authenticated_header(admin)
          }.to change { Challenge.count }.by(-1)

          expect(response).to have_http_status(204)
          expect(challenger.challenges.count).to be_zero
          expect(challengee.challenges.count).to be_zero
        end

        it 'destroys the challenge when the challengee\'s user_challenge is deleted' do
          user_challenge_id = challengee.user_challenges.first.id
          expect {
            delete "#{endpoint}#{user_challenge_id}", headers: authenticated_header(admin)
          }.to change { Challenge.count }.by(-1)

          expect(response).to have_http_status(204)
          expect(challenger.challenges.count).to be_zero
          expect(challengee.challenges.count).to be_zero
        end
      end
    end

    context 'on a tri challenge' do
      let!(:challenge) { create(:tri_challenge) }
      let!(:first_challenger) { challenge.users.select(&:alternate?).first }
      let!(:second_challenger) { challenge.users.select(&:alternate?).last }
      let!(:challengee) { challenge.users.reject(&:alternate?).first }

      context 'and the request isn\'t made by an admin' do
        it 'destroys the challenge when the first challenger leaves' do
          user_challenge_id = first_challenger.user_challenges.first.id
          expect {
            delete "#{endpoint}#{user_challenge_id}", headers: authenticated_header(first_challenger)
          }.to change { Challenge.count }.by(-1)

          expect(response).to have_http_status(204)
          expect(first_challenger.challenges.count).to be_zero
          expect(second_challenger.challenges.count).to be_zero
          expect(challengee.challenges.count).to be_zero
        end

        it 'destroys the challenge when the second challenger leaves' do
          user_challenge_id = second_challenger.user_challenges.first.id
          expect {
            delete "#{endpoint}#{user_challenge_id}", headers: authenticated_header(second_challenger)
          }.to change { Challenge.count }.by(-1)

          expect(response).to have_http_status(204)
          expect(first_challenger.challenges.count).to be_zero
          expect(second_challenger.challenges.count).to be_zero
          expect(challengee.challenges.count).to be_zero
        end

        it 'returns a 403 when the challengee tries to leave the challenge' do
          user_challenge_id = challengee.user_challenges.first.id
          expect {
            delete "#{endpoint}#{user_challenge_id}", headers: authenticated_header(challengee)
          }.not_to change { Challenge.count }

          expect(response).to have_http_status(403)
        end
      end

      context 'and the request is made by an admin' do
        it 'destroys the challenge when the first challenger\'s user_challenge is deleted' do
          user_challenge_id = first_challenger.user_challenges.first.id
          expect {
            delete "#{endpoint}#{user_challenge_id}", headers: authenticated_header(admin)
          }.to change { Challenge.count }.by(-1)

          expect(response).to have_http_status(204)
          expect(first_challenger.challenges.count).to be_zero
          expect(second_challenger.challenges.count).to be_zero
          expect(challengee.challenges.count).to be_zero
        end

        it 'destroys the challenge when the second challenger\'s user_challenge is deleted' do
          user_challenge_id = second_challenger.user_challenges.first.id
          expect {
            delete "#{endpoint}#{user_challenge_id}", headers: authenticated_header(admin)
          }.to change { Challenge.count }.by(-1)

          expect(response).to have_http_status(204)
          expect(first_challenger.challenges.count).to be_zero
          expect(second_challenger.challenges.count).to be_zero
          expect(challengee.challenges.count).to be_zero
        end

        it 'destroys the challenge when the challengee\'s user_challenge is deleted' do
          user_challenge_id = challengee.user_challenges.first.id
          expect {
            delete "#{endpoint}#{user_challenge_id}", headers: authenticated_header(admin)
          }.to change { Challenge.count }.by(-1)

          expect(response).to have_http_status(204)
          expect(first_challenger.challenges.count).to be_zero
          expect(second_challenger.challenges.count).to be_zero
          expect(challengee.challenges.count).to be_zero
        end
      end
    end

    context 'on an open spot challenge' do
      context 'that has only one challenger' do
        let!(:challenge) { create(:open_spot_challenge) }
        let(:challenger) { challenge.users.first }

        context 'and the requesting user isn\'t an admin' do
          it 'destroys the challenge when the user leaves' do
            user_challenge_id = challenger.user_challenges.first.id
            expect {
              delete "#{endpoint}#{user_challenge_id}", headers: authenticated_header(challenger)
            }.to change { Challenge.count }.by(-1)

            expect(response).to have_http_status(204)
            expect(challenger.challenges.count).to be_zero
          end
        end

        context 'and the requesting user is an admin' do
          it 'destroys the challenge when the user leaves' do
            user_challenge_id = challenger.user_challenges.first.id
            expect {
              delete "#{endpoint}#{user_challenge_id}", headers: authenticated_header(admin)
            }.to change { Challenge.count }.by(-1)

            expect(response).to have_http_status(204)
            expect(challenger.challenges.count).to be_zero
          end
        end
      end

      context 'that has two challengers' do
        let!(:challenge) { create(:full_open_spot_challenge) }
        let(:first_challenger) { challenge.users.first }
        let(:second_challenger) { challenge.users.last }

        context 'and the requesting user isn\'t an admin' do
          it 'doesn\'t destroy the challenge if the first challenger leaves' do
            user_challenge_id = first_challenger.user_challenges.first.id
            expect {
              delete "#{endpoint}#{user_challenge_id}", headers: authenticated_header(first_challenger)
            }.not_to change { Challenge.count }

            expect(response).to have_http_status(204)
            expect(second_challenger.challenges.count).to be > 0
            expect(first_challenger.challenges.count).to be_zero
          end

          it 'doesn\'t destroy the challenge if the second challenger leaves' do
            user_challenge_id = second_challenger.user_challenges.first.id
            expect {
              delete "#{endpoint}#{user_challenge_id}", headers: authenticated_header(second_challenger)
            }.not_to change { Challenge.count }

            expect(response).to have_http_status(204)
            expect(first_challenger.challenges.count).to be > 0
            expect(second_challenger.challenges.count).to be_zero
          end
        end

        context 'and the requesting user is an admin' do
          it 'doesn\'t destroy the challenge when the first challenger leaves' do
            user_challenge_id = first_challenger.user_challenges.first.id
            expect {
              delete "#{endpoint}#{user_challenge_id}", headers: authenticated_header(admin)
            }.not_to change { Challenge.count }

            expect(response).to have_http_status(204)
            expect(second_challenger.challenges.count).to be > 0
            expect(first_challenger.challenges.count).to be_zero
          end

          it 'doesn\'t destroy the challenge when the second challenger leaves' do
            user_challenge_id = second_challenger.user_challenges.first.id
            expect {
              delete "#{endpoint}#{user_challenge_id}", headers: authenticated_header(admin)
            }.not_to change { Challenge.count }

            expect(response).to have_http_status(204)
            expect(first_challenger.challenges.count).to be > 0
            expect(second_challenger.challenges.count).to be_zero
          end
        end
      end
    end
  end
end
