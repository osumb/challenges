require 'test_helper'
require_relative '../../lib/seed/users'

def end_point
  '/api/performances/challengeable_users'
end

def challengeable_user_shape
  {
    'buckId': true,
    'challengeId': true,
    'challengeType': true,
    'file': true,
    'firstName': true,
    'lastName': true,
    'openSpot': true,
    'row': true,
    'membersInChallenge': true
  }
end

def shape?(c_user)
  return false unless c_user.keys.length == challengeable_user_shape.keys.length
  c_user.all? { |key, _| challengeable_user_shape[key.to_sym] }
end

class ChallengeableUsersTest < ActionDispatch::IntegrationTest
  def authenticated_header(user)
    token = Knock::AuthToken.new(payload: user.to_token_payload).token

    {
      'Accept': 'application/json, text/html',
      'Authorization': "Bearer #{token}"
    }
  end

  test 'it responds successfully' do
    user = create(:alternate)
    get end_point, headers: authenticated_header(user)

    assert_response :success
  end

  test 'it returns an array' do
    user = create(:alternate)
    get end_point, headers: authenticated_header(user)

    challengeable_users = JSON.parse(response.body)['challengeableUsers']
    assert_equal Array, challengeable_users.class
  end

  test 'it returns the correct shape of data' do
    create(:performance)
    challenger_spot = create(:spot, row: Spot.rows[:a], file: 13)
    challengee_spot = create(:spot, row: Spot.rows[:a], file: 2)
    challenger = create(:alternate, instrument: User.instruments[:trumpet], part: User.parts[:solo], spot: challenger_spot)
    create(:user, instrument: User.instruments[:trumpet], part: User.parts[:solo], spot: challengee_spot, buck_id: "#{challenger.buck_id}1", email: "#{challenger.email}a")

    get end_point, headers: authenticated_header(challenger)

    challengeable_users = JSON.parse(response.body)['challengeableUsers']
    challengeable_user = challengeable_users.first
    assert shape? challengeable_user
  end

  test 'it returns an empty array if there is no current performance' do
    challenger_spot = create(:spot, row: Spot.rows[:a], file: 13)
    challengee_spot = create(:spot, row: Spot.rows[:a], file: 2)
    challenger = create(:alternate, instrument: User.instruments[:trumpet], part: User.parts[:solo], spot: challenger_spot)
    create(:user, instrument: User.instruments[:trumpet], part: User.parts[:solo], spot: challengee_spot, buck_id: "#{challenger.buck_id}1", email: "#{challenger.email}a")

    get end_point, headers: authenticated_header(challenger)

    challengeable_users = JSON.parse(response.body)['challengeableUsers']
    refute challengeable_users.length.positive?
  end

  test 'it returns an empty array if the requesting user is an admin' do
    create(:performance)
    challengee_spot = create(:spot, row: Spot.rows[:a], file: 2)
    challenger = create(:admin, instrument: User.instruments[:trumpet], part: User.parts[:solo])
    create(:user, instrument: User.instruments[:trumpet], part: User.parts[:solo], spot: challengee_spot, buck_id: "#{challenger.buck_id}1", email: "#{challenger.email}a")

    get end_point, headers: authenticated_header(challenger)

    challengeable_users = JSON.parse(response.body)['challengeableUsers']
    refute challengeable_users.length.positive?
  end
end
