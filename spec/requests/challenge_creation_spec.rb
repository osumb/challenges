require 'rails_helper'

# The purpose of this test file is to test the controller action for creating (and ONLY creating) challenges
describe 'Challenge Creation', type: :request do
  let(:challenges_endpoint) { '/api/challenges/' }
  let!(:performance) { create(:performance) }
  let!(:challenger) { create(:alternate_user, :trumpet, :solo, :spot_a13) }
  let!(:other_challenger) { create(:alternate_user, :trumpet, :solo, :spot_a14) }
  let!(:challengee) { create(:user, :trumpet, :solo, :spot_a2) }
  let!(:other_challengee) { create(:user, :trumpet, :solo, :spot_a1) }
  let(:admin) { create(:admin_user) }
  let(:params) do
    {
      spot: {
        row: challengee.current_spot.row.upcase,
        file: challengee.current_spot.file
      }
    }
  end

  describe 'POST /api/challenges/' do
    context 'but the request bad because' do
      context 'the spot in request is an alternate spot so' do
        let(:params) do
          {
            spot: {
              row: challengee.current_spot.row.upcase,
              file: 13
            }
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

      context 'the performance window isn\'t open so' do
        let(:performance) { create(:stale_performance) }

        it 'returns a 403' do
          expect {
            post challenges_endpoint, params: params.to_json, headers: authenticated_header(challenger)
          }.not_to change { Challenge.count }

          expect(response).to have_http_status(403)
          expect(JSON.parse(response.body)['errors'].join).to include('window not open')
        end
      end

      context 'the user is challenging someone of a different instrument so' do
        let(:challenger) { create(:alternate_user, :mellophone, :first, :spot_r13) }

        it 'returns a 403' do
          expect {
            post challenges_endpoint, params: params.to_json, headers: authenticated_header(challenger)
          }.not_to change { Challenge.count }

          expect(response).to have_http_status(403)
          expect(JSON.parse(response.body)['errors'].join).to include('can\'t challenge someone of a different instrument or part')
        end
      end

      context 'the user is challenging someone of a different part so' do
        let(:challenger) { create(:alternate_user, :trumpet, :second, :spot_b14) }

        it 'returns a 403' do
          expect {
            post challenges_endpoint, params: params.to_json, headers: authenticated_header(challenger)
          }.not_to change { Challenge.count }

          expect(response).to have_http_status(403)
          expect(JSON.parse(response.body)['errors'].join).to include('can\'t challenge someone of a different instrument or part')
        end
      end

      context 'the requesting user is trying to challenge the spot twice so' do
        it 'returns a 403' do
          post challenges_endpoint, params: params.to_json, headers: authenticated_header(challenger)
          expect {
            post challenges_endpoint, params: params.to_json, headers: authenticated_header(other_challenger)
          }.not_to change { Challenge.count }

          expect(response).to have_http_status(403)
          expect(JSON.parse(response.body)['errors'].join).to include('spot has already been challenged')
        end
      end

      context 'a user tries to make a second challenge so' do
        let(:other_params) do
          {
            challenge_type: 'normal',
            spot: {
              row: other_challengee.current_spot.row.upcase,
              file: other_challengee.current_spot.file
            },
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

    context 'an admin tries to' do
      let(:params) do
        {
          challenger_buck_id: challenger.buck_id,
          spot: {
            row: challengee.current_spot.row.upcase,
            file: challengee.current_spot.file
          }
        }
      end

      context 'create a normal challenge and' do
        it 'successfully creates a normal challenge' do
          expect {
            post challenges_endpoint, params: params.to_json, headers: authenticated_header(admin)
          }.to change { Challenge.count }.by(1)

          challenge = JSON.parse(response.body)['challenge']

          expect(challenge).to include('challenge_type' => 'normal',
                                       'spot' => {
                                         'row' => challengee.current_spot.row.upcase,
                                         'file' => challengee.current_spot.file
                                       },
                                       'users' => contain_exactly(
                                         include('id' => challenger.id),
                                         include('id' => challengee.id)
                                       ))
        end
      end

      context 'create a tri challenge and' do
        let!(:challenger) { create(:alternate_user, :percussion, :cymbals, :spot_j13) }
        let!(:challengee) { create(:user, :percussion, :cymbals, :spot_j3) }
        let!(:other_user) { create(:alternate_user, :percussion, :cymbals, :spot_j17) }
        let(:params) do
          {
            challenger_buck_id: challenger.buck_id,
            spot: {
              row: challengee.current_spot.row.upcase,
              file: challengee.current_spot.file
            }
          }
        end

        it 'successfully creates a tri challenge' do
          expect {
            post challenges_endpoint, params: params.to_json, headers: authenticated_header(admin)
          }.to change { Challenge.count }.by(1)

          challenge = JSON.parse(response.body)['challenge']

          expect(challenge).to include('challenge_type' => 'tri',
                                       'spot' => {
                                         'row' => challengee.current_spot.row.upcase,
                                         'file' => challengee.current_spot.file
                                       },
                                       'users' => contain_exactly(
                                         include('id' => challenger.id),
                                         include('id' => challengee.id),
                                         include('id' => other_user.id)
                                       ))
        end
      end

      context 'create an open spot challenge and' do
        before do
          create(:discipline_action, user: challengee, open_spot: true, performance: performance)
        end

        it 'successfully creates a open spot challenge' do
          expect {
            post challenges_endpoint, params: params.to_json, headers: authenticated_header(admin)
          }.to change { Challenge.count }.by(1)

          challenge = JSON.parse(response.body)['challenge']

          expect(challenge).to include('challenge_type' => 'open_spot',
                                       'spot' => {
                                         'row' => challengee.current_spot.row.upcase,
                                         'file' => challengee.current_spot.file
                                       },
                                       'users' => contain_exactly(
                                         include('id' => challenger.id)
                                       ))
        end
      end
    end

    context 'a nom admin tries to' do
      let(:params) do
        {
          spot: {
            row: challengee.current_spot.row.upcase,
            file: challengee.current_spot.file
          }
        }
      end

      context 'create a normal challenge and' do
        it 'successfully creates a normal challenge' do
          expect {
            post challenges_endpoint, params: params.to_json, headers: authenticated_header(challenger)
          }.to change { Challenge.count }.by(1)

          challenge = JSON.parse(response.body)['challenge']

          expect(challenge).to include('challenge_type' => 'normal',
                                       'spot' => {
                                         'row' => challengee.current_spot.row.upcase,
                                         'file' => challengee.current_spot.file
                                       },
                                       'users' => contain_exactly(
                                         include('id' => challenger.id),
                                         include('id' => challengee.id)
                                       ))
        end
      end

      context 'create a tri challenge and' do
        let!(:challenger) { create(:alternate_user, :percussion, :cymbals, :spot_j13) }
        let!(:challengee) { create(:user, :percussion, :cymbals, :spot_j3) }
        let!(:other_user) { create(:alternate_user, :percussion, :cymbals, :spot_j17) }
        let(:params) do
          {
            spot: {
              row: challengee.current_spot.row.upcase,
              file: challengee.current_spot.file
            }
          }
        end

        it 'successfully creates a tri challenge' do
          expect {
            post challenges_endpoint, params: params.to_json, headers: authenticated_header(challenger)
          }.to change { Challenge.count }.by(1)

          challenge = JSON.parse(response.body)['challenge']

          expect(challenge).to include('challenge_type' => 'tri',
                                       'spot' => {
                                         'row' => challengee.current_spot.row.upcase,
                                         'file' => challengee.current_spot.file
                                       },
                                       'users' => contain_exactly(
                                         include('id' => challenger.id),
                                         include('id' => challengee.id),
                                         include('id' => other_user.id)
                                       ))
        end
      end

      context 'create an open spot challenge and' do
        before do
          create(:discipline_action, user: challengee, open_spot: true, performance: performance)
        end

        it 'successfully creates a open spot challenge' do
          expect {
            post challenges_endpoint, params: params.to_json, headers: authenticated_header(challenger)
          }.to change { Challenge.count }.by(1)

          challenge = JSON.parse(response.body)['challenge']

          expect(challenge).to include('challenge_type' => 'open_spot',
                                       'spot' => {
                                         'row' => challengee.current_spot.row.upcase,
                                         'file' => challengee.current_spot.file
                                       },
                                       'users' => contain_exactly(
                                         include('id' => challenger.id)
                                       ))
        end
      end
    end
  end
end
