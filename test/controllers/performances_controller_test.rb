require 'test_helper'

class PerformancesControllerTest < ActionDispatch::IntegrationTest
  def end_point
    '/api/performances'
  end

  def performance_params
    {
      name: 'Best name ever',
      window_open: Time.zone.now,
      window_close: Time.zone.now + 3.hours,
      date: Time.zone.now + 1.week
    }
  end

  setup do
    @user = create(:admin_user)
  end

  test 'it successfully creates a performance' do
    post end_point, params: performance_params.to_json, headers: authenticated_header(@user)

    assert_equal 201, response.status
    assert Performance.count.positive?
  end

  test 'it returns a 401 when a non admin tries to create a performance' do
    old_performance_count = Performance.count
    @user = create(:user)
    post end_point, params: performance_params.to_json, headers: authenticated_header(@user)

    assert_equal 401, response.status
    assert_equal old_performance_count, Performance.count
  end

  test 'it errors when creating a performance without a name' do
    old_performance_count = Performance.count
    post end_point, params: performance_params.except(:name).to_json, headers: authenticated_header(@user)

    assert_equal old_performance_count, Performance.count
    assert_equal 409, response.status
  end

  test 'it errors when creating a performance without a date' do
    old_performance_count = Performance.count
    post end_point, params: performance_params.except(:date).to_json, headers: authenticated_header(@user)

    assert_equal old_performance_count, Performance.count
    assert_equal 409, response.status
  end

  test 'it errors when creating a performance without a window_close' do
    old_performance_count = Performance.count
    post end_point, params: performance_params.except(:window_close).to_json, headers: authenticated_header(@user)

    assert_equal old_performance_count, Performance.count
    assert_equal 409, response.status
  end

  test 'it errors when creating a performance without a window_open' do
    old_performance_count = Performance.count
    post end_point, params: performance_params.except(:window_open).to_json, headers: authenticated_header(@user)

    assert_equal old_performance_count, Performance.count
    assert_equal 409, response.status
  end

  test 'it errors when creating a performance with window_close < window_open' do
    old_performance_count = Performance.count
    params = performance_params
    params[:window_open] = performance_params[:window_close]
    params[:window_close] = performance_params[:window_open]

    post end_point, params: performance_params.except(:window_open).to_json, headers: authenticated_header(@user)

    assert_equal old_performance_count, Performance.count
    assert_equal 409, response.status
  end
end
