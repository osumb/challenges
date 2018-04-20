require 'rails_helper'

RSpec.describe SessionsController do
  describe 'GET new' do
    context 'authenticated' do
      include_context 'with authentication'

      it 'redirects to /logged_in' do
        get :new
        expect(response).to redirect_to('/logged_in')
      end
    end

    context 'not authenticated' do
      it 'renders new' do
        get :new
        expect(response).to render_template('new')
      end
    end
  end

  describe 'GET show' do
    context 'authenticated' do
      include_context 'with authentication'

      it 'renders show' do
        get :show
        expect(response).to render_template('show')
      end
    end

    context 'not authenticated' do
      it 'redirects to /login' do
        get :show
        expect(response).to redirect_to('/login')
      end
    end
  end

  describe 'POST create' do
    context 'authenticated' do
      include_context 'with authentication'

      it 'redirects to /logged_in' do
        get :new
        expect(response).to redirect_to('/logged_in')
      end
    end

    context 'not authenticated' do
      context 'with correct credentials' do
        let(:password) { 'password' }
        let(:user) { create(:user, password: password) }
        let(:params) do
          {
            buck_id: user.buck_id,
            password: password
          }
        end

        it 'redirects to /logged_in' do
          post :create, params: params

          expect(response).to redirect_to('/logged_in')
        end

        it 'sets the session\'s buck_id' do
          post :create, params: params

          expect(controller.session[:buck_id]).to eq(user.buck_id)
        end
      end

      context 'with incorrect credentials' do
        let(:password) { 'password' }
        let(:user) { create(:user, password: password) }
        let(:params) do
          {
            buck_id: user.buck_id,
            password: password + 'whoops'
          }
        end

        it 'renders new again' do
          post :create, params: params

          expect(response).to render_template('new')
        end

        it 'does not set the session\'s buck_id' do
          post :create, params: params

          expect(controller.session[:buck_id]).to be_nil
        end
      end
    end
  end

  describe 'GET destroy' do
    context 'authenticated' do
      include_context 'with authentication'

      it 'clears the current session' do
        get :destroy
        expect(controller.session[:buck_id]).to be_nil
      end

      it 'redirects to /login' do
        get :destroy
        expect(response).to redirect_to('/login')
      end
    end

    context 'not authenticated' do
      it 'redirects to /login' do
        get :destroy
        expect(response).to redirect_to('/login')
      end
    end
  end
end
