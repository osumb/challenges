require 'rails_helper'

describe 'Performances', type: :request do
  let(:endpoint) { '/api/performances/' }
  let(:admin) { create(:admin_user) }
  let(:user) { create(:user) }
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
      it 'successfully creates a performance' do
        expect {
          post endpoint, params: performance_params.to_json, headers: authenticated_header(admin)
        }.to change { Performance.count }.by(1)

        expect(response).to have_http_status(201)
      end

      context 'but the params are bad' do
        it 'is invalid without a name' do
          performance_params[:performance].except!(:name)

          expect {
            post endpoint, params: performance_params.to_json, headers: authenticated_header(admin)
          }.not_to change { Performance.count }

          expect(response).to have_http_status(409)
        end

        it 'is invalid without a date' do
          performance_params[:performance].except!(:date)

          expect {
            post endpoint, params: performance_params.to_json, headers: authenticated_header(admin)
          }.not_to change { Performance.count }

          expect(response).to have_http_status(409)
        end

        it 'is invalid without a window_close' do
          performance_params[:performance].except!(:window_close)

          expect {
            post endpoint, params: performance_params.to_json, headers: authenticated_header(admin)
          }.not_to change { Performance.count }

          expect(response).to have_http_status(409)
        end

        it 'is invalid without a window_open' do
          performance_params[:performance].except!(:window_open)

          expect {
            post endpoint, params: performance_params.to_json, headers: authenticated_header(admin)
          }.not_to change { Performance.count }

          expect(response).to have_http_status(409)
        end

        it 'is invalid with window_close < window_open' do
          params = performance_params.deep_dup
          params[:performance][:window_open] = performance_params[:performance][:window_close]
          params[:performance][:window_close] = performance_params[:performance][:window_open]

          expect {
            post endpoint, params: params.to_json, headers: authenticated_header(admin)
          }.not_to change { Performance.count }

          expect(response).to have_http_status(409)
        end
      end
    end

    context 'when the user is an not admin' do
      it 'does not create a performance' do
        expect {
          post endpoint, params: performance_params.to_json, headers: authenticated_header(user)
        }.not_to change { Performance.count }

        expect(response).to have_http_status(403)
      end
    end
  end

  describe 'GET /api/performances' do
    let!(:performance) { create(:performance) }
    let(:performance_shape) do
      {
        id: true,
        date: true,
        name: true,
        window_close: true,
        window_open: true
      }
    end

    context 'when an admin makes a request' do
      it 'returns an array of performances' do
        get endpoint, headers: authenticated_header(admin)

        body = JSON.parse(response.body)

        expect(body['performances']).to be_instance_of(Array)
        expect(body['performances'].first).to be_shape_of(performance_shape)
      end
    end

    context 'when a non admin makes a request' do
      it 'returns a 403' do
        get endpoint, headers: authenticated_header(user)

        expect(response).to have_http_status(403)
      end
    end
  end

  describe 'PUT /api/performances' do
    let!(:performance) { create(:performance) }
    let!(:params) do
      {
        performance: {
          name: "#{performance.name}-this is different now :D",
          date: Time.zone.now + 7.days,
          window_open: Time.zone.now,
          window_close: Time.zone.now + 3.hours
        }
      }
    end

    context 'requesting user is an admin' do
      it 'updates the performance' do
        put "#{endpoint}#{performance.id}", params: params.to_json, headers: authenticated_header(admin)

        performance.reload

        expect(response).to have_http_status(200)
        params[:performance].each do |key, value|
          # to_s because Ruby's time precision is better than database, so the == check fails
          expect(value.to_s).to eq(performance[key].to_s)
        end
      end

      context 'but the name is blank' do
        it 'returns a 409' do
          params[:performance][:name] = nil
          put "#{endpoint}#{performance.id}", params: params.to_json, headers: authenticated_header(admin)

          expect(response).to have_http_status(409)
        end
      end

      context 'but the date is blank' do
        it 'returns a 409' do
          params[:performance][:date] = nil
          put "#{endpoint}#{performance.id}", params: params.to_json, headers: authenticated_header(admin)

          expect(response).to have_http_status(409)
        end
      end

      context 'but the window_open is blank' do
        it 'returns a 409' do
          params[:performance][:window_open] = nil
          put "#{endpoint}#{performance.id}", params: params.to_json, headers: authenticated_header(admin)

          expect(response).to have_http_status(409)
        end
      end

      context 'but the window_close is blank' do
        it 'returns a 409' do
          params[:performance][:window_close] = nil
          put "#{endpoint}#{performance.id}", params: params.to_json, headers: authenticated_header(admin)

          expect(response).to have_http_status(409)
        end
      end

      context 'but the window_open > window_close is blank' do
        it 'returns a 409' do
          params[:performance][:window_open] = Time.zone.now + 10.days
          params[:performance][:window_close] = Time.zone.now
          put "#{endpoint}#{performance.id}", params: params.to_json, headers: authenticated_header(admin)

          expect(response).to have_http_status(409)
        end
      end

      context 'but the performance window has alredy closed' do
        let!(:performance) { create(:stale_performance) }
        it 'returns a 403' do
          put "#{endpoint}#{performance.id}", params: params.to_json, headers: authenticated_header(admin)

          expect(response).to have_http_status(403)
        end
      end
    end

    context 'requesting user is not an admin' do
      it 'returns a 403' do
        put "#{endpoint}#{performance.id}", params: params.to_json, headers: authenticated_header(user)

        expect(response).to have_http_status(403)
      end
    end
  end
end
