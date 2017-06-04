require 'rails_helper'

describe 'Performances', type: :request do
  let(:endpoint) { '/api/performances/' }
  let(:user) { create(:admin_user) }
  let(:performance_params) do
    {
      performance: {
        name: 'Best name ever',
        window_open: Time.zone.now,
        window_close: Time.zone.now + 3.hours,
        date: Time.zone.now + 1.week
      }
    }
  end

  describe 'POST /api/performances/' do
    context 'when the user is an admin' do
      let(:user) { create(:admin_user) }

      it 'successfully creates a performance' do
        expect {
          post endpoint, params: performance_params.to_json, headers: authenticated_header(user)
        }.to change { Performance.count }.by(1)

        expect(response).to have_http_status(201)
      end

      context 'but the params are bad' do
        it 'is invalid without a name' do
          performance_params[:performance].except!(:name)

          expect {
            post endpoint, params: performance_params.to_json, headers: authenticated_header(user)
          }.not_to change { Performance.count }

          expect(response).to have_http_status(409)
        end

        it 'is invalid without a date' do
          performance_params[:performance].except!(:date)

          expect {
            post endpoint, params: performance_params.to_json, headers: authenticated_header(user)
          }.not_to change { Performance.count }

          expect(response).to have_http_status(409)
        end

        it 'is invalid without a window_close' do
          performance_params[:performance].except!(:window_close)

          expect {
            post endpoint, params: performance_params.to_json, headers: authenticated_header(user)
          }.not_to change { Performance.count }

          expect(response).to have_http_status(409)
        end

        it 'is invalid without a window_open' do
          performance_params[:performance].except!(:window_open)

          expect {
            post endpoint, params: performance_params.to_json, headers: authenticated_header(user)
          }.not_to change { Performance.count }

          expect(response).to have_http_status(409)
        end

        it 'is invalid with window_close < window_open' do
          params = performance_params.deep_dup
          params[:performance][:window_open] = performance_params[:performance][:window_close]
          params[:performance][:window_close] = performance_params[:performance][:window_open]

          expect {
            post endpoint, params: params.to_json, headers: authenticated_header(user)
          }.not_to change { Performance.count }

          expect(response).to have_http_status(409)
        end
      end
    end

    context 'when the user is an not admin' do
      let(:user) { create(:user) }

      it 'does not create a performance' do
        expect {
          post endpoint, params: performance_params.to_json, headers: authenticated_header(user)
        }.not_to change { Performance.count }

        expect(response).to have_http_status(403)
      end
    end
  end
end
