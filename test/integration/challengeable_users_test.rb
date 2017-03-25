require 'test_helper'

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
  test 'it responds successfully' do
    user = create(:alternate_user)
    get end_point, headers: authenticated_header(user)

    assert_response :success
  end

  test 'it returns an array' do
    user = create(:alternate_user)
    get end_point, headers: authenticated_header(user)

    challengeable_users = JSON.parse(response.body)['challengeableUsers']
    assert_equal Array, challengeable_users.class
  end

  test 'it returns the correct shape of data' do
    create(:performance)
    challenger = create(:alternate_user, :trumpet, :solo, :spot_a13)
    create(:user, :trumpet, :solo, :spot_a2)

    get end_point, headers: authenticated_header(challenger)

    challengeable_users = JSON.parse(response.body)['challengeableUsers']
    challengeable_user = challengeable_users.first
    assert shape? challengeable_user
  end

  test 'it returns an empty array if there is no current performance' do
    challenger = create(:alternate_user, :trumpet, :solo, :spot_a13)
    create(:user, :trumpet, :solo, :spot_a2)

    get end_point, headers: authenticated_header(challenger)

    challengeable_users = JSON.parse(response.body)['challengeableUsers']
    refute challengeable_users.length.positive?
  end

  test 'it returns an empty array if the requesting user is an admin' do
    create(:performance)
    challenger = create(:admin_user, :trumpet, :solo)
    create(:user, :trumpet, :solo, :spot_a2)
    get end_point, headers: authenticated_header(challenger)

    challengeable_users = JSON.parse(response.body)['challengeableUsers']
    refute challengeable_users.length.positive?
  end
end
