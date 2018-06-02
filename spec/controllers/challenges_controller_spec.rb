require 'rails_helper'

RSpec.describe ChallengesController do
  describe 'GET new' do
    context 'authenticated' do
      include_context 'with authentication'

      it 'renders' do
        get :new
        expect(response).to render_template('new')
      end
    end

    context 'not authenticated' do
      it 'redirects to login' do
        get :new
        expect(response).to redirect_to('/login')
      end
    end
  end
end
