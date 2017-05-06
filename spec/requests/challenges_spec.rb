require 'rails_helper'

describe 'Challengeable Users', type: :request do
  let(:challenges_endpoint) { '/api/challenges/' }
  let(:user_challenges_endpoint) { '/api/user_challenges/' }
  let!(:performance) { create(:performance) }
  let!(:challenger) { create(:alternate_user, :trumpet, :solo, :spot_a13) }
  let!(:other_challenger) { create(:alternate_user, :trumpet, :solo, :spot_a14) }
  let!(:challengee) { create(:user, :trumpet, :solo, :spot_a2) }
  let!(:other_challengee) { create(:user, :trumpet, :solo, :spot_a1) }

  describe 'POST /api/challenges/' do
    context 'normal challenges' do
      let(:params) do
        {
          challenge_type: 'normal',
          row: challengee.spot.row.upcase,
          file: challengee.spot.file,
          performance_id: performance.id
        }
      end

      it 'successfully creates a normal challenge' do
        expect {
          post challenges_endpoint, params: params.to_json, headers: authenticated_header(challenger)
        }.to change { Challenge.count }.by(1)

        challenge = JSON.parse(response.body)['challenge']

        expect(challenge).to include({
          'challenge_type' => 'normal',
          'spot' => {
            'row' => challengee.spot.row.upcase,
            'file' => challengee.spot.file,
          },
          'users' => contain_exactly(
            include('id' => challenger.id),
            include('id' => challengee.id)
          )
        })
      end

      it 'destroys the challenge when the user leaves' do
        post challenges_endpoint, params: params.to_json, headers: authenticated_header(challenger)

        user_challenge_id = challenger.user_challenges.first.id
        expect {
          delete "#{user_challenges_endpoint}#{user_challenge_id}", headers: authenticated_header(challenger)
        }.to change { Challenge.count }.by(-1)

        expect(response).to have_http_status(204)
        expect(challenger.challenges.count).to be_zero
        expect(challengee.challenges.count).to be_zero
      end

      it 'returns a 403 when the user challenged tries to leave the challenge' do
        post challenges_endpoint, params: params.to_json, headers: authenticated_header(challenger)

        user_challenge_id = challengee.user_challenges.first.id
        expect {
          delete "#{user_challenges_endpoint}#{user_challenge_id}", headers: authenticated_header(challengee)
        }.not_to change { Challenge.count }

        expect(response).to have_http_status(403)
      end

      it 'returns a 403 when a user tries to join a full challenge by creating a new user_challenge' do
        post challenges_endpoint, params: params.to_json, headers: authenticated_header(challenger)

        other_params = {
          challenge_id: JSON.parse(response.body)['challenge']['id']
        }
        expect {
          post user_challenges_endpoint, params: other_params.to_json, headers: authenticated_header(other_challenger)
        }.not_to change { UserChallenge.count }

        expect(response).to have_http_status(403)
        expect(JSON.parse(response.body)['errors'].join).to include('challenge is already full')
      end

      context 'when the performance is stale' do
        let(:performance) { create(:stale_performance) }

        it 'returns a 403' do
          expect {
            post challenges_endpoint, params: params.to_json, headers: authenticated_header(challenger)
          }.not_to change { Challenge.count }

          expect(response).to have_http_status(403)
          expect(JSON.parse(response.body)['errors'].join).to include('window not open')
        end
      end

      context 'when the user is challenging someone of a different instrument' do
        let(:challenger) { create(:alternate_user, :mellophone, :first, :spot_r13) }

        it 'returns a 403' do
          expect {
            post challenges_endpoint, params: params.to_json, headers: authenticated_header(challenger)
          }.not_to change { Challenge.count }


          expect(response).to have_http_status(403)
          expect(JSON.parse(response.body)['errors'].join).to include('can\'t challenge someone of a different instrument or part')
        end
      end

      context 'when the user is challenging someone of a different part' do
        let(:challenger) { create(:alternate_user, :trumpet, :second, :spot_b14) }

        it 'returns a 403' do
          expect {
            post challenges_endpoint, params: params.to_json, headers: authenticated_header(challenger)
          }.not_to change { Challenge.count }


          expect(response).to have_http_status(403)
          expect(JSON.parse(response.body)['errors'].join).to include('can\'t challenge someone of a different instrument or part')
        end
      end

      context 'when the user is challenging an alternate spot' do
        let(:params) do
          {
            challenge_type: 'normal',
            row: challengee.spot.row.upcase,
            file: 13,
            performance_id: performance.id
          }
        end

        it 'returns a 403' do
          expect {
            post challenges_endpoint, params: params.to_json, headers: authenticated_header(challenger)
          }.not_to change { Challenge.count }

          expect(response).to have_http_status(403)
          expect(JSON.parse(response.body)['errors'].join).to include('can\'t challenge alternate')
        end
      end

      context 'when trying to challenge the spot twice' do
        it 'returns a 403' do
          post challenges_endpoint, params: params.to_json, headers: authenticated_header(challenger)
          expect {
            post challenges_endpoint, params: params.to_json, headers: authenticated_header(other_challenger)
          }.not_to change { Challenge.count }

          expect(response).to have_http_status(403)
          expect(JSON.parse(response.body)['errors'].join).to include('spot has already been challenged')
        end
      end

      context 'when a user tries to make a second challenge' do
        let(:other_params) do
          {
            challenge_type: 'normal',
            row: other_challengee.spot.row.upcase,
            file: other_challengee.spot.file,
            performance_id: performance.id
          }
        end

        it 'returns a 403' do
          post challenges_endpoint, params: params.to_json, headers: authenticated_header(challenger)

          expect {
            post challenges_endpoint, params: other_params.to_json, headers: authenticated_header(challenger)
          }.not_to change { Challenge.count }

          expect(response).to have_http_status(403)
          expect(JSON.parse(response.body)['errors'].join).to include('can\'t make more than one challenge')
        end
      end
    end

    context 'tri challenges' do
      let!(:challenger) { create(:alternate_user, :percussion, :cymbals, :spot_j13) }
      let!(:challengee) { create(:user, :percussion, :cymbals, :spot_j3) }
      let!(:other_user) { create(:alternate_user, :percussion, :cymbals, :spot_j17) }
      let(:params) do
        {
          challenge_type: 'tri',
          row: challengee.spot.row.upcase,
          file: challengee.spot.file,
          performance_id: performance.id
        }
      end

      it 'successfully creates a tri challenge' do
        expect {
          post challenges_endpoint, params: params.to_json, headers: authenticated_header(challenger)
        }.to change { Challenge.count }.by(1)

        challenge = JSON.parse(response.body)['challenge']

        expect(challenge).to include({
          'challenge_type' => 'tri',
          'spot' => {
            'row' => challengee.spot.row.upcase,
            'file' => challengee.spot.file,
          },
          'users' => contain_exactly(
            include('id' => challenger.id),
            include('id' => challengee.id),
            include('id' => other_user.id)
          )
        })
      end

      it 'destroys the challenge when a user leaves' do
        post challenges_endpoint, params: params.to_json, headers: authenticated_header(challenger)

        user_challenge_id = other_user.user_challenges.first.id
        expect {
          delete "#{user_challenges_endpoint}#{user_challenge_id}", headers: authenticated_header(other_user)
        }.to change { Challenge.count }.by(-1)

        expect(response).to have_http_status(204)
        expect(challenger.challenges.count).to be_zero
        expect(challengee.challenges.count).to be_zero
        expect(other_user.challenges.count).to be_zero
      end

      it 'returns a 403 when the user challenged tries to leave the challenge' do
        post challenges_endpoint, params: params.to_json, headers: authenticated_header(challenger)

        user_challenge_id = challengee.user_challenges.first.id
        expect {
          delete "#{user_challenges_endpoint}#{user_challenge_id}", headers: authenticated_header(challengee)
        }.not_to change { Challenge.count }

        expect(response).to have_http_status(403)
      end

      context 'when there are not enough users' do
        let!(:other_user) { nil }

        it 'returns a 403' do
          expect {
            post challenges_endpoint, params: params.to_json, headers: authenticated_header(challenger)
          }.not_to change { Challenge.count }

          expect(response).to have_http_status(403)
          expect(JSON.parse(response.body)['errors'].join).to include('not enough users for tri challenge')
        end
      end
    end

    context 'open spot challenges' do
      let(:params) do
        {
          challenge_type: 'open_spot',
          row: challengee.spot.row.upcase,
          file: challengee.spot.file,
          performance_id: performance.id
        }
      end

      before do
        create(:discipline_action, user: challengee, open_spot: true, performance: performance)
      end

      it 'successfully creates a open spot challenge' do
        expect {
          post challenges_endpoint, params: params.to_json, headers: authenticated_header(challenger)
        }.to change { Challenge.count }.by(1)

        challenge = JSON.parse(response.body)['challenge']

        expect(challenge).to include({
          'challenge_type' => 'open_spot',
          'spot' => {
            'row' => challengee.spot.row.upcase,
            'file' => challengee.spot.file,
          },
          'users' => contain_exactly(
            include('id' => challenger.id)
          )
        })
      end

      it 'destroys the challenge if the only challenger leaves' do
        post challenges_endpoint, params: params.to_json, headers: authenticated_header(challenger)

        user_challenge_id = challenger.user_challenges.first.id
        expect {
          delete "#{user_challenges_endpoint}#{user_challenge_id}", headers: authenticated_header(challenger)
        }.to change { Challenge.count }.by(-1)

        expect(response).to have_http_status(204)
        expect(challenger.challenges.count).to be_zero
      end

      it 'does not destroy the challenge if there are remaining challengers after a user leaves' do
        post challenges_endpoint, params: params.to_json, headers: authenticated_header(challenger)
        post challenges_endpoint, params: params.to_json, headers: authenticated_header(other_challenger)


        user_challenge_id = challenger.user_challenges.first.id
        expect {
          delete "#{user_challenges_endpoint}#{user_challenge_id}", headers: authenticated_header(challenger)
        }.not_to change { Challenge.count }

        expect(response).to have_http_status(204)
        expect(other_challenger.challenges.count).to be > 0
        expect(challenger.challenges.count).to be_zero
      end

      context 'when the spot is not open' do
        before do
          challengee.discipline_actions.destroy_all
        end

        it 'returns a 403' do
          expect {
            post challenges_endpoint, params: params.to_json, headers: authenticated_header(challenger)
          }.not_to change { Challenge.count }

          expect(response).to have_http_status(403)
          expect(JSON.parse(response.body)['errors'].join).to include('can\'t make a challenge of type open_spot that is open')
        end
      end

      context 'when two people challenge a spot' do
        it 'adds both users to the challenge' do
          expect {
            post challenges_endpoint, params: params.to_json, headers: authenticated_header(challenger)
            post challenges_endpoint, params: params.to_json, headers: authenticated_header(other_challenger)
          }.to change { UserChallenge.count }.by(2)

          expect(challenger.challenges.count).to eq(1)
          expect(other_challenger.challenges.count).to eq(1)
        end
      end
    end
  end
end
