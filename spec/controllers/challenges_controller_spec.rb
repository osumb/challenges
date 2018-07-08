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
          expect { request }.not_to change { Challenge.count }
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
          expect { request }.not_to change { Challenge.count }
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
          expect { request }.not_to change { Challenge.count }
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
          expect { request }.not_to change { Challenge.count }
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

  describe 'GET evaluate' do
    let!(:current_user) { create(:admin_user) }
    let(:performance) { create(:stale_performance) }
    let(:request) { get :evaluate }
    let(:expected_authenticated_response) { render_template('evaluate') }
    let(:expected_unauthenticated_response) { redirect_to('/login') }
    let!(:first_challenge) { create(:normal_challenge, performance: performance) }
    let!(:second_challenge) { create(:tri_challenge, performance: performance) }

    it_behaves_like 'controller_authentication'

    context 'when authenticated' do
      include_context 'with authentication'

      it 'uses Challenge.evaluable to get the proper challenges' do
        expect(Challenge).to receive(:evaluable).with(current_user).and_call_original

        request
      end

      it 'sets the @challenges variable', :aggregate_failures do
        request

        expect(assigns(:challenges)).to be_an_instance_of(Array)
        expect(assigns(:challenges).length).to eq(2)
      end

      it 'sets the @visible_challenge instance variable to the first available challenge sorted by spot' do
        request

        expect(assigns(:visible_challenge)).to eq(first_challenge)
      end

      context 'when no challenge has a stale performance' do
        let(:performance) { create(:performance) }

        it 'sets @challenges to an empty array' do
          request

          expect(assigns(:challenges)).to eq([])
        end
      end

      context 'when passed the visible_challenge_id query param' do
        context 'but the challenge doesn\'t exist' do
          it 'sets the instance variable @visible_challenge to the first challenge sorted by spot' do
            get :evaluate, params: { visible_challenge: '10000000000000' }

            expect(assigns(:visible_challenge)).to eq(first_challenge)
          end
        end

        it 'sets the instance variable visible_challenge according to the query param' do
          get :evaluate, params: { visible_challenge: first_challenge.id }

          expect(assigns(:visible_challenge)).to eq(first_challenge)
        end
      end
    end
  end

  describe 'PUT update' do
    let!(:challenge) { create(:normal_challenge) }
    let(:current_user) { create(:admin_user) }
    let(:user_challenges) { challenge.user_challenges }
    let(:update_type) { 'Save' }
    let(:first_user_challenge_place) { UserChallenge.places[:first] }
    let(:second_user_challenge_place) { UserChallenge.places[:second] }
    let(:params) do
      {
        'challenge' => {
          'user_challenges_attributes' => {
            '0' => {
              'id' => user_challenges.first.id,
              'comments' => 'Comments for the first user challenge',
              'place' => first_user_challenge_place
            },
            '1' => {
              'id' => user_challenges.second.id,
              'comments' => 'Comments for the second user challenge',
              'place' => second_user_challenge_place
            }
          }
        },
        'id' => challenge.id,
        'update_type' => update_type
      }
    end
    let(:request) { put :update, params: params }
    let(:expected_authenticated_response) { have_http_status(:redirect) }
    let(:expected_unauthenticated_response) { redirect_to('/login') }

    it_behaves_like 'controller_authentication'

    context 'authenticated' do
      include_context 'with authentication'

      it 'updates the user challenges', :aggregate_failures do
        put :update, params: params

        user_challenges.each(&:reload)

        expect(user_challenges.first.comments).to eq('Comments for the first user challenge')
        expect(user_challenges.second.comments).to eq('Comments for the second user challenge')
        expect(user_challenges.first.place).to eq('first')
        expect(user_challenges.second.place).to eq('second')
      end

      it 'redirects back with a flash message', :aggregate_failures do
        request

        expect(response).to have_http_status(:redirect)
        expect(flash[:message]).to eq('Successfully saved challenge!')
      end

      context 'But the places aren\'t submitted' do
        let(:first_user_challenge_place) { nil }

        it 'redirects back with a flash error', :aggregate_failures do
          request

          expect(response).to have_http_status(:redirect)
          expect(flash[:error]).to eq('Please make sure all of the following places are selected: [1, 2]. Missing: [1]')
        end

        it 'saves the comments', :aggregate_failures do
          put :update, params: params

          user_challenges.each(&:reload)

          expect(user_challenges.first.comments).to eq('Comments for the first user challenge')
          expect(user_challenges.second.comments).to eq('Comments for the second user challenge')
        end

        it 'doesn\'t save the places', :aggregate_failures do
          put :update, params: params

          user_challenges.each(&:reload)

          expect(user_challenges.first.place).to be_nil
          expect(user_challenges.second.place).to be_nil
        end
      end

      context 'But not all required places are submitted' do
        let(:second_user_challenge_place) { UserChallenge.places[:third] }

        it 'redirects back with a flash error', :aggregate_failures do
          request

          expect(response).to have_http_status(:redirect)
          expect(flash[:error]).to eq('Please make sure all of the following places are selected: [1, 2]. Missing: [2]')
        end

        it 'saves the comments', :aggregate_failures do
          put :update, params: params

          user_challenges.each(&:reload)

          expect(user_challenges.first.comments).to eq('Comments for the first user challenge')
          expect(user_challenges.second.comments).to eq('Comments for the second user challenge')
        end

        it 'doesn\'t save the places', :aggregate_failures do
          put :update, params: params

          user_challenges.each(&:reload)

          expect(user_challenges.first.place).to be_nil
          expect(user_challenges.second.place).to be_nil
        end
      end

      context 'Redirect id' do
        let(:new_params) { params.merge('redirect_id' => 1000) }

        it 'redirects to the id specified with a flash message', :aggregate_failures do
          put :update, params: new_params

          expect(response).to redirect_to('/challenges/evaluate?visible_challenge=1000')
          expect(flash[:message]).to eq('Successfully saved challenge!')
        end
      end

      context 'Submit' do
        let(:update_type) { 'Submit' }

        it 'updates the user challenges', :aggregate_failures do
          put :update, params: params

          user_challenges.each(&:reload)

          expect(user_challenges.first.comments).to eq('Comments for the first user challenge')
          expect(user_challenges.second.comments).to eq('Comments for the second user challenge')
          expect(user_challenges.first.place).to eq('first')
          expect(user_challenges.second.place).to eq('second')
        end

        it 'moves the challenge to :done' do
          put :update, params: params

          expect(challenge.reload.done_stage?).to be(true)
        end

        it 'calls the CheckOtherChallengesDoneJob' do
          expect(CheckOtherChallengesDoneJob).to receive(:perform_later).and_call_original

          put :update, params: params
        end

        it 'redirects to the base evaluation route with flash message', :aggregate_failures do
          request

          expect(response).to redirect_to('/challenges/evaluate')
          expect(flash[:message]).to eq('Successfully submitted challenge!')
        end
      end
    end
  end
end
