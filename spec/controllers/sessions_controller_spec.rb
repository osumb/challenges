require 'rails_helper'

RSpec.describe SessionsController do
  let(:current_user) { create(:user) }

  describe 'GET new' do
    let(:request) { get :new }
    let(:expected_authenticated_response) { redirect_to('/logged_in') }
    let(:expected_unauthenticated_response) { render_template('new') }

    it_behaves_like 'controller_authentication'
  end

  describe 'GET show' do
    let(:request) { get :show }
    let(:expected_authenticated_response) { render_template('show') }
    let(:expected_unauthenticated_response) { redirect_to('/login') }

    it_behaves_like 'controller_authentication'
  end

  describe 'POST create' do
    let(:password) { 'password' }
    let(:user) { create(:admin_user, password: password) }
    let(:params) do
      {
        buck_id: user.buck_id,
        password: password
      }
    end
    let(:request) { post :create, params: params }
    let(:expected_authenticated_response) { redirect_to('/logged_in') }
    let(:expected_unauthenticated_response) { redirect_to('/logged_in') }

    it_behaves_like 'controller_authentication'

    context 'not authenticated' do
      context 'with correct credentials' do
        it 'redirects to /logged_in' do
          request
          expect(response).to redirect_to('/logged_in')
        end

        it 'sets the session\'s buck_id' do
          request
          expect(controller.session[:buck_id]).to eq(user.buck_id)
        end
      end

      context 'with incorrect credentials' do
        let(:params) do
          {
            buck_id: user.buck_id,
            password: password + 'whoops'
          }
        end

        it 'renders new again' do
          request
          expect(response).to render_template('new')
        end

        it 'does not set the session\'s buck_id' do
          request
          expect(controller.session[:buck_id]).to be_nil
        end
      end
    end
  end

  describe 'GET destroy' do
    let(:request) { get :destroy }
    let(:expected_authenticated_response) { redirect_to('/logged_in') }
    let(:expected_unauthenticated_response) { redirect_to('/login') }

    context 'authenticated' do
      include_context 'with authentication'

      it 'clears the current session' do
        get :destroy
        expect(controller.session[:buck_id]).to be_nil
      end
    end
  end
end
