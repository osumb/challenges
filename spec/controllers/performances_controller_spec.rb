require 'rails_helper'

RSpec.describe PerformancesController do
  describe 'POST create' do
    let(:current_user) { create(:admin_user) }
    let(:request) { post :create, params: params }
    let(:name) { 'Super cool new performance' }
    let(:date) { Time.zone.today + 10.days }
    let(:window_close) { Time.zone.today + 3.hours }
    let(:window_open) { Time.zone.today }
    let(:timezone) { 'UTC' }

    let(:params) do
      {
        timezone: timezone,
        performance: {
          name: name,
          date: date,
          window_close: window_close,
          window_open: window_open
        }
      }
    end
    let(:expected_authenticated_response) { redirect_to('/performances/new') }
    let(:expected_unauthenticated_response) { redirect_to('/login') }

    it_behaves_like 'controller_authentication'

    context 'when authenticated' do
      include_context 'with authentication'

      it 'creates a new performance' do
        expect do
          request
        end.to change { Performance.count }.by(1)
      end

      it 'calls the job QueueNewPerformanceEmailsJob' do
        expect(QueueNewPerformanceEmailsJob).to receive(:perform_later).with(performance_id: anything)
        request
      end

      context 'but there are errors' do
        let(:window_close) { window_open - 1.day }

        it 'redirects with a flash message' do
          expect do
            request
          end.not_to change { Performance.count }

          expect(flash[:errors]).not_to be_nil
        end
      end

      context 'but the current user isn\'t an admin' do
        let(:current_user) { create(:user) }

        it 'returns a :not_found' do
          request

          expect(response).to have_http_status(:not_found)
        end
      end
    end
  end

  describe 'GET new' do
    let(:current_user) { create(:admin_user) }
    let(:request) { get :new }
    let(:expected_authenticated_response) { render_template(:new) }
    let(:expected_unauthenticated_response) { redirect_to('/login') }

    it_behaves_like 'controller_authentication'

    context 'but the user isn\'t an admin' do
      include_context 'with authentication'

      let(:current_user) { create(:user) }

      it 'returns a :not_found' do
        request

        expect(response).to have_http_status(:not_found)
      end
    end
  end
end
