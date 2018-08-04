require 'rails_helper'

RSpec.describe UsersController do
  describe 'GET index' do
    let(:current_user) { create(:admin_user) }
    let(:request) { get :index, params: params }
    let(:expected_authenticated_response) { render_template(:index) }
    let(:expected_unauthenticated_response) { redirect_to('/login') }
    let(:row) { nil }
    let(:params) { { row: row } }
    let!(:second_a_row_user) { create(:user, :spot_a2) }
    let!(:first_a_row_user) { create(:user, :spot_a1) }
    let!(:second_x_row_user) { create(:user, :spot_x2) }
    let!(:first_x_row_user) { create(:user, :spot_x1) }

    it_behaves_like 'controller_authentication'

    context 'when authenticated' do
      include_context 'with authentication'

      it 'returns all the users in the first row', :aggregate_failures do
        request

        users = assigns(:users)

        expect(users).to include(first_a_row_user)
        expect(users).to include(second_a_row_user)
        expect(users).not_to include(first_x_row_user)
        expect(users).not_to include(second_x_row_user)
      end

      it 'returns all the users in the first row sorted by spot' do
        request

        users = assigns(:users)

        expect(users).to eq([first_a_row_user, second_a_row_user])
      end

      context 'when passed a row' do
        let(:row) { 'x' }

        it 'returns all the users in that row' do
          request

          users = assigns(:users)

          expect(users).to eq([first_x_row_user, second_x_row_user])
        end

        it 'returns all the users in the passed row', :aggregate_failures do
          request

          users = assigns(:users)

          expect(users).not_to include(first_a_row_user)
          expect(users).not_to include(second_a_row_user)
          expect(users).to include(first_x_row_user)
          expect(users).to include(second_x_row_user)
        end
      end

      context 'but the current user is not an admin' do
        let(:current_user) { first_a_row_user }

        it 'returns a :not_found' do
          request

          expect(response).to have_http_status(:not_found)
        end
      end
    end
  end

  describe 'GET search' do
    let(:current_user) { create(:admin_user) }
    let(:request) { get :search }
    let(:expected_authenticated_response) { render_template(:search) }
    let(:expected_unauthenticated_response) { redirect_to('/login') }

    it_behaves_like 'controller_authentication'

    context 'when authenticated' do
      include_context 'with authentication'

      context 'and a search was made' do
        let(:request) { get :search, params: { query: query } }

        it 'doesn\'t return any admin users' do
          get :search, params: { query: current_user.first_name }

          expect(assigns(:users)).not_to include(current_user)
        end

        context 'for just the user\'s first name' do
          let(:user) { create(:user) }
          let(:query) { user.first_name }

          it 'returns the user' do
            request

            expect(assigns(:users)).to eq([user])
          end
        end

        context 'for just the user\'s last name' do
          let(:user) { create(:user) }
          let(:query) { user.last_name }

          it 'returns the user' do
            request

            expect(assigns(:users)).to eq([user])
          end
        end

        context 'for both the user\'s first and last name' do
          let(:user) { create(:user) }
          let(:query) { user.full_name }

          it 'returns the user' do
            request

            expect(assigns(:users)).to eq([user])
          end
        end

        context 'but the query string is empty' do
          let!(:user) { create(:user) }
          let(:query) { '' }

          it 'returns an empty list' do
            request

            expect(assigns(:users)).to be_empty
          end
        end
      end

      context 'but a search wasn\'t made' do
        it 'does not return any users' do
          request

          expect(assigns(:users)).to eq([])
        end
      end

      context 'but the current user is not an admin' do
        let(:current_user) { create(:user) }

        it 'returns a :not_found' do
          request

          expect(response).to have_http_status(:not_found)
        end
      end
    end
  end

  describe 'GET show' do
    let(:current_user) { create(:admin_user) }
    let(:user) { create(:user) }
    let(:switch_spot) { nil }
    let(:request) { get :show, params: { id: user.buck_id, switch_spot: switch_spot } }
    let(:expected_authenticated_response) { render_template(:show) }
    let(:expected_unauthenticated_response) { redirect_to('/login') }

    it_behaves_like 'controller_authentication'

    context 'when authenticated' do
      include_context 'with authentication'

      it 'sets the user' do
        request

        expect(assigns(:user)).to eq(user)
      end

      it 'is found when the buck_id has a \'-\' in it' do
        user = create(:user, buck_id: 'last-name.1')

        get :show, params: { id: user.buck_id }

        expect(assigns(:user)).to eq(user)
      end

      it 'assigns @show_switch_submit_button to be false' do
        request

        expect(assigns(:show_switch_submit_button)).to be(false)
      end

      context 'and there is an upcoming performance' do
        let!(:performance) { create(:performance) }

        it 'sets the performance' do
          request

          expect(assigns(:performance)).to eq(performance)
        end

        context 'and the user has a challenge for this performance' do
          let!(:challenge) do
            create(
              :normal_challenge,
              users: [
                user,
                create(:user, current_spot: create(:spot, row: user.current_spot.row, file: user.current_spot.file + 1))
              ],
              performance: performance
            )
          end

          it 'sets the current_challenge' do
            request

            expect(assigns(:current_challenge)).to eq(challenge)
          end

          it 'doesn\'t include that challenge in the list of past challenges' do
            request

            expect(assigns(:past_challenges)).not_to include(challenge)
          end
        end

        context 'and the user has been disciplined for this challenge' do
          let!(:discipline_action) { create(:discipline_action, user: user, performance: performance) }

          it 'sets the current_discipline_action' do
            request

            expect(assigns(:current_discipline_action)).to eq(discipline_action)
          end

          it 'doesn\'t include that disipline action in the list of past discipline actions' do
            request

            expect(assigns(:past_discipline_actions)).not_to include(discipline_action)
          end
        end
      end

      context 'and there isn\'t an upcoming performance' do
        let!(:performance) { create(:stale_performance) }

        it 'sets the performance do nil' do
          request

          expect(assigns(:performance)).to be_nil
        end

        context 'and the user has previous challenges' do
          let!(:challenge) do
            create(
              :normal_challenge,
              users: [
                user,
                create(:user, current_spot: create(:spot, row: user.current_spot.row, file: user.current_spot.file + 1))
              ],
              performance: performance,
              stage: :done
            )
          end

          it 'doesn\'t set a current challenge' do
            request

            expect(assigns(:current_challenge)).to be_nil
          end

          it 'sets the past_challenges' do
            request

            expect(assigns(:past_challenges)).to eq([challenge])
          end

          context 'but none of them are in the done stage' do
            before do
              challenge.stage = :needs_comments
              challenge.save!
            end

            it 'sets an empty list for past_challenges' do
              request

              expect(assigns(:past_challenges)).to be_empty
            end
          end
        end

        context 'and the user has previous discipline_actions' do
          let!(:discipline_action) { create(:discipline_action, user: user, performance: performance) }

          it 'doesn\'t set a current discipline action' do
            request

            expect(assigns(:current_discipline_action)).to be_nil
          end

          it 'sets the past_discipline_actions' do
            request

            expect(assigns(:past_discipline_actions)).to eq([discipline_action])
          end
        end
      end

      context 'and the param switch_spot is passed' do
        let!(:spot) { create(:spot, row: :a, file: 5) }
        let(:switch_spot) { spot.to_s }
        let!(:other_user) { create(:user, current_spot: spot) }

        context 'and the spot is invalid' do
          let(:switch_spot) { 'invalid spot' }

          it 'flashes an error' do
            request

            expect(flash[:switch_error]).to eq("Spot '#{switch_spot}' isn't a spot")
          end

          it 'assigns @show_switch_submit_button to be false' do
            request

            expect(assigns(:show_switch_submit_button)).to be(false)
          end
        end

        context 'but the user can\'t have that spot' do
          let(:switch_spot) { create(:spot, row: :q, file: 3).to_s }

          it 'flashes an error' do
            request

            expect(flash[:switch_error]).to eq("#{user.first_name} can't have spot #{switch_spot}")
          end

          it 'assigns @show_switch_submit_button to be false' do
            request

            expect(assigns(:show_switch_submit_button)).to be(false)
          end
        end

        it 'flashes a message' do
          request

          expect(flash[:switch_message]).to eq("#{switch_spot} currently belongs to #{other_user.full_name}. Are you sure you want to make this switch?")
        end

        it 'assigns @show_switch_submit_button to be true' do
          request

          expect(assigns(:show_switch_submit_button)).to be(true)
        end
      end

      context 'but the current user is not an admin' do
        let(:current_user) { user }

        it 'returns a :not_found' do
          request

          expect(response).to have_http_status(:not_found)
        end
      end
    end
  end

  describe 'PUT update' do
    let(:current_user) { create(:admin_user) }
    let(:request) { put :update, params: params }
    let(:expected_authenticated_response) { have_http_status(:redirect) }
    let(:expected_unauthenticated_response) { redirect_to('/login') }
    let!(:user) { create(:user, part: 'efer') }
    let(:part) { 'first' }
    let(:params) do
      {
        id: user.buck_id,
        user: {
          part: part
        }
      }
    end

    it_behaves_like 'controller_authentication'

    context 'when authenticated' do
      include_context 'with authentication'

      it 'updates the user' do
        request

        expect(user.reload.part).to eq('first')
      end

      context 'but the part is invalid' do
        let(:part) { 'snare' }

        it 'doesn\'t update the user' do
          original_part = user.part

          request

          expect(user.reload.part).to eq(original_part)
        end
      end

      context 'but the current user is not an admin' do
        let(:current_user) { user }

        it 'returns a :not_found' do
          request

          expect(response).to have_http_status(:not_found)
        end
      end
    end
  end

  describe 'POST switch_spot' do
    let(:current_user) { create(:admin_user) }
    let!(:user) { create(:user, :trumpet, :solo) }
    let!(:target_user) { create(:user, :trumpet, :solo, :spot_a4) }
    let(:request) { put :switch_spot, params: params }
    let(:expected_authenticated_response) { redirect_to("/users/#{user.buck_id}") }
    let(:expected_unauthenticated_response) { redirect_to('/login') }
    let(:spot) { target_user.current_spot.to_s }
    let(:params) do
      {
        id: user.buck_id,
        spot: spot
      }
    end

    it_behaves_like 'controller_authentication'

    context 'with authentication' do
      include_context 'with authentication'

      it 'successfully switches two user\'s spots', :aggregate_failures do
        request

        old_user_spot = user.current_spot
        target_spot = target_user.current_spot
        user.reload
        target_user.reload

        expect(user.current_spot).to eq(target_spot)
        expect(target_user.current_spot).to eq(old_user_spot)
      end

      context 'but the spot doesn\'t exist' do
        let(:spot) { 'a15' }

        it 'returns a :not_found' do
          request

          expect(response).to have_http_status(:not_found)
        end
      end

      context 'but the current user is not an admin' do
        let(:current_user) { user }

        it 'returns a :not_found' do
          request

          expect(response).to have_http_status(:not_found)
        end
      end
    end
  end
end
