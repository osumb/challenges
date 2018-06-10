require 'rails_helper'

RSpec.describe ChallengesController do
  describe 'GET new' do
    let(:current_user) { create(:user) }
    let(:request) { get :new }
    let(:expected_authenticated_response) { render_template('new') }
    let(:expected_unauthenticated_response) { redirect_to('/login') }

    it_behaves_like 'controller_authentication'
  end

  describe 'POST create' do
    let!(:performance) { create(:performance) }
    let!(:challenger) { create(:alternate_user, :trumpet, :solo, :spot_a13) }
    let!(:challengee) { create(:user, :trumpet, :solo, :spot_a3) }
    let!(:current_user) { challenger }
    let(:params) do
      {
        'challenge-select' => {
          challenger_buck_id: challenger.buck_id,
          spot: {
            row: challengee.current_spot.row,
            file: challengee.current_spot.file
          }
        }.to_json
      }
    end

    let(:request) { post :create, params: params }
    let(:expected_response) { redirect_to('/challenges/new') }
    let(:expected_authenticated_response) { redirect_to('/challenges/new') }
    let(:expected_unauthenticated_response) { redirect_to('/login') }

    it_behaves_like 'controller_authentication'

    context 'but a challenge cannot be made' do
      include_context 'with authentication'

      context 'because a non admin is trying to make a challenge for someone else' do
        let!(:current_user) { create(:user, :trumpet, :solo, :spot_a14) }

        it 'doesn\'t create a new challenge' do
          expect { request }.not_to change { Challenge.count } # rubocop:disable Lint/AmbiguousBlockAssociation
        end

        it 'redirects to /challenges/new' do
          request
          expect(response).to redirect_to('/challenges/new')
        end

        it 'sets the correct flash message' do
          request
          expect(flash[:error]).to eq("You're not authorized to create a challenge for user with id #{challenger.buck_id}")
        end
      end

      context 'because the performance is invalid' do
        before { Performance.delete_all }

        it 'doesn\'t create a new challenge' do
          expect { request }.not_to change { Challenge.count } # rubocop:disable Lint/AmbiguousBlockAssociation
        end

        it 'returns a :bad_request' do
          request

          expect(response).to have_http_status(:bad_request)
        end
      end

      context 'because the user has a discipline action that prevents them from making a challenge' do
        before do
          create(:discipline_action, user: current_user, allowed_to_challenge: false, performance: performance)
        end

        it 'doesn\'t create a new challenge' do
          expect { request }.not_to change { Challenge.count } # rubocop:disable Lint/AmbiguousBlockAssociation
        end

        it 'returns a :bad_request' do
          request

          expect(response).to have_http_status(:bad_request)
        end
      end

      context 'because the user has already made a challenge' do
        before do
          ChallengeCreationService.create_challenge(
            challenger: challenger,
            performance: performance,
            spot: challengee.current_spot
          )
        end

        it 'doesn\'t create a new challenge' do
          expect { request }.not_to change { Challenge.count } # rubocop:disable Lint/AmbiguousBlockAssociation
        end

        it 'returns a :bad_request' do
          request

          expect(response).to have_http_status(:bad_request)
        end
      end
    end

    context 'with an admin user' do
      include_context 'with authentication'

      let!(:current_user) { create(:admin_user) }

      it 'creates a new challenge' do
        expect { request }.to change { Challenge.count }.by(1)
      end

      it 'sends a challenge success email' do
        expect(ChallengeSuccessMailer).to receive(:challenge_success_email).with(
          challenge_id: Integer,
          email: challenger.email,
          initiator_buck_id: current_user.buck_id
        ).and_call_original

        request
      end
    end

    context 'with a non admin user' do
      include_context 'with authentication'

      it 'creates a new challenge' do
        expect { request }.to change { Challenge.count }.by(1)
      end

      it 'sends a challenge success email' do
        expect(ChallengeSuccessMailer).to receive(:challenge_success_email).with(
          challenge_id: Integer,
          email: challenger.email,
          initiator_buck_id: current_user.buck_id
        ).and_call_original

        request
      end
    end

    context 'but the creation fails' do
      include_context 'with authentication'

      before do
        allow(ChallengeCreationService).to receive(:create_challenge).and_return(
          OpenStruct.new(success?: false, challenge: nil, errors: 'Bad things happened')
        )
      end

      it 'redirects to /challenges/new' do
        expect(request).to redirect_to('/challenges/new')
      end

      it 'adds the correct flash error message' do
        request

        expect(flash[:error]).to eq('Couldn\'t create challenge at this time. Please refresh and try again')
      end
    end
  end
end
