require 'rails_helper'

RSpec.describe UsersController do
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
    let(:request) { get :show, params: { id: user.buck_id } }
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
              performance: performance
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
