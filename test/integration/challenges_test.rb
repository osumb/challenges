require 'test_helper'

class CreateChallengeTest < ActionDispatch::IntegrationTest
  def challenge_end_point
    '/api/challenges/'
  end

  def user_challenge_end_point
    '/api/user_challenges/'
  end

  test 'it successfully creates a normal challenge' do
    old_challenge_count = Challenge.count
    performance = create(:performance)
    challenger = create(:alternate_user, :trumpet, :solo, :spot_a13)
    challengee = create(:user, :trumpet, :solo, :spot_a2)
    body = {
      challenge_type: 'normal',
      file: 2,
      row: 'a',
      performance_id: performance.id
    }
    post challenge_end_point, params: body.to_json, headers: authenticated_header(challenger)

    challenge = JSON.parse(response.body)['challenge']

    assert_equal 'normal', challenge['challenge_type']
    assert_equal 'A', challenge['spot']['row']
    assert_equal 2, challenge['spot']['file']
    assert_equal 2, challenge['users'].length
    assert challenge['users'].any? { |u| u['id'] == challenger.id }
    assert challenge['users'].any? { |u| u['id'] == challengee.id }
    assert_equal old_challenge_count + 1, Challenge.count
  end

  test 'it successfully creates a tri challenge' do
    old_challenge_count = Challenge.count
    performance = create(:performance)
    challenger = create(:alternate_user, :percussion, :cymbals, :spot_j13)
    challengee = create(:user, :percussion, :cymbals, :spot_j3)
    other_user = create(:alternate_user, :percussion, :cymbals, :spot_j17)
    body = {
      challenge_type: 'tri',
      file: 3,
      row: 'j',
      performance_id: performance.id
    }
    post challenge_end_point, params: body.to_json, headers: authenticated_header(challenger)

    challenge = JSON.parse(response.body)['challenge']

    assert_equal 'tri', challenge['challenge_type']
    assert_equal 'J', challenge['spot']['row']
    assert_equal 3, challenge['spot']['file']
    assert_equal 3, challenge['users'].length
    assert challenge['users'].any? { |u| u['id'] == challenger.id }
    assert challenge['users'].any? { |u| u['id'] == challengee.id }
    assert challenge['users'].any? { |u| u['id'] == other_user.id }
    assert_equal old_challenge_count + 1, Challenge.count
  end

  test 'it successfully creates an open spot challenge' do
    old_challenge_count = Challenge.count
    performance = create(:performance)
    challenger = create(:alternate_user, :mellophone, :first, :spot_r13)
    challengee = create(:user, :mellophone, :first, :spot_e2)
    body = {
      challenge_type: 'open_spot',
      file: 2,
      row: 'e',
      performance_id: performance.id
    }
    create(:discipline_action, user: challengee, open_spot: true, performance: performance)
    post challenge_end_point, params: body.to_json, headers: authenticated_header(challenger)

    challenge = JSON.parse(response.body)['challenge']

    assert_equal 'open_spot', challenge['challenge_type']
    assert_equal 'E', challenge['spot']['row']
    assert_equal 2, challenge['spot']['file']
    assert_equal 1, challenge['users'].length
    assert challenge['users'].any? { |u| u['id'] == challenger.id }
    assert_equal old_challenge_count + 1, Challenge.count
  end

  test 'it destroys the entire open spot challenge if the only challenger removes himself from it' do
    old_challenge_count = Challenge.count
    performance = create(:performance)
    challenger = create(:alternate_user, :mellophone, :first, :spot_r13)
    challengee = create(:user, :mellophone, :first, :spot_e2)
    body = {
      challenge_type: 'open_spot',
      file: 2,
      row: 'e',
      performance_id: performance.id
    }
    create(:discipline_action, user: challengee, open_spot: true, performance: performance)
    post challenge_end_point, params: body.to_json, headers: authenticated_header(challenger)

    user_challenge_id = challenger.user_challenges.first.id
    delete "#{user_challenge_end_point}#{user_challenge_id}", headers: authenticated_header(challenger)

    assert_equal 204, response.status
    assert_equal old_challenge_count, Challenge.count
    refute challenger.challenges.length.positive?
  end

  test 'it doesn\t destroy the entire open spot challenge if there are remaining challengers after a user removes himself from it' do
    performance = create(:performance)
    challenger = create(:alternate_user, :mellophone, :first, :spot_r13)
    other_challenger = create(:alternate_user, :mellophone, :first, :spot_e13)
    challengee = create(:user, :mellophone, :first, :spot_e2)
    body = {
      challenge_type: 'open_spot',
      file: 2,
      row: 'e',
      performance_id: performance.id
    }
    create(:discipline_action, user: challengee, open_spot: true, performance: performance)
    post challenge_end_point, params: body.to_json, headers: authenticated_header(challenger)
    post challenge_end_point, params: body.to_json, headers: authenticated_header(other_challenger)

    old_challenge_count = Challenge.count
    user_challenge_id = challenger.user_challenges.first.id
    delete "#{user_challenge_end_point}#{user_challenge_id}", headers: authenticated_header(challenger)

    assert_equal 204, response.status # the user_challenge data should have been destroyed
    assert_equal old_challenge_count, Challenge.count
    assert other_challenger.challenges.length.positive?
    refute challenger.challenges.length.positive?
  end

  test 'it destroys the associated normal challenge when a user removes herself from it' do
    old_challenge_count = Challenge.count
    performance = create(:performance)
    challenger = create(:alternate_user, :trumpet, :solo, :spot_a13)
    challengee = create(:user, :trumpet, :solo, :spot_a2)
    body = {
      challenge_type: 'normal',
      file: 2,
      row: 'a',
      performance_id: performance.id
    }
    post challenge_end_point, params: body.to_json, headers: authenticated_header(challenger)

    user_challenge_id = challenger.user_challenges.first.id

    delete "#{user_challenge_end_point}#{user_challenge_id}", headers: authenticated_header(challenger)

    assert_equal 204, response.status
    assert_equal old_challenge_count, Challenge.count
    refute challenger.challenges.length.positive?
    refute challengee.challenges.length.positive?
  end

  test 'it destroys the associated tri challenge when a user removes herself from it' do
    old_challenge_count = Challenge.count
    performance = create(:performance)
    challenger = create(:alternate_user, :percussion, :cymbals, :spot_j13)
    challengee = create(:user, :percussion, :cymbals, :spot_j3)
    other_user = create(:alternate_user, :percussion, :cymbals, :spot_j17)
    body = {
      challenge_type: 'tri',
      file: 3,
      row: 'j',
      performance_id: performance.id
    }
    post challenge_end_point, params: body.to_json, headers: authenticated_header(challenger)

    user_challenge_id = other_user.user_challenges.first.id
    delete "#{user_challenge_end_point}#{user_challenge_id}", headers: authenticated_header(other_user)

    assert_equal 204, response.status
    assert_equal old_challenge_count, Challenge.count
    refute challenger.challenges.length.positive?
    refute challengee.challenges.length.positive?
    refute other_user.challenges.length.positive?
  end

  test 'it returns a 403 when the user challenged tries to remove herself from a normal challenge' do
    performance = create(:performance)
    challenger = create(:alternate_user, :trumpet, :solo, :spot_a13)
    challengee = create(:user, :trumpet, :solo, :spot_a2)
    body = {
      challenge_type: 'normal',
      file: 2,
      row: 'a',
      performance_id: performance.id
    }
    post challenge_end_point, params: body.to_json, headers: authenticated_header(challenger)

    old_challenge_count = Challenge.count
    user_challenge_id = challengee.user_challenges.first.id
    delete "#{user_challenge_end_point}#{user_challenge_id}", headers: authenticated_header(challengee)

    assert_equal 403, response.status
    assert_equal old_challenge_count, Challenge.count
  end

  test 'it returns a 403 when the user challenged tries to remove herself from a tri challenge' do
    performance = create(:performance)
    challenger = create(:alternate_user, :percussion, :cymbals, :spot_j13)
    challengee = create(:user, :percussion, :cymbals, :spot_j3)
    create(:alternate_user, :percussion, :cymbals, :spot_j17)
    body = {
      challenge_type: 'tri',
      file: 3,
      row: 'j',
      performance_id: performance.id
    }
    post challenge_end_point, params: body.to_json, headers: authenticated_header(challenger)

    old_challenge_count = Challenge.count
    user_challenge_id = challengee.user_challenges.first.id
    delete "#{user_challenge_end_point}#{user_challenge_id}", headers: authenticated_header(challengee)

    assert_equal 403, response.status
    assert_equal old_challenge_count, Challenge.count
  end

  test 'it returns a 403 when a user tries to join a full challenge by creating a new user_challenge' do
    performance = create(:performance)
    challenger = create(:alternate_user, :trumpet, :solo, :spot_a13)
    other_challenger = create(:alternate_user, :trumpet, :solo, :spot_x13)
    create(:user, :trumpet, :solo, :spot_a2)
    body = {
      challenge_type: 'normal',
      file: 2,
      row: 'a',
      performance_id: performance.id
    }
    post challenge_end_point, params: body.to_json, headers: authenticated_header(challenger)

    challenge = JSON.parse(response.body)['challenge']
    other_body = {
      challenge_id: challenge['id']
    }
    post user_challenge_end_point, params: other_body.to_json, headers: authenticated_header(other_challenger)

    errors = JSON.parse(response.body)['errors']
    assert_equal 403, response.status
    assert errors.join.include? 'challenge is already full'
  end

  test 'it returns a 403 when the associated performance is stale' do
    performance = create(:stale_performance)
    challenger = create(:alternate_user, :trumpet, :solo, :spot_a13)
    create(:user, :trumpet, :solo, :spot_a2)
    body = {
      challenge_type: 'normal',
      file: 2,
      row: 'a',
      performance_id: performance.id
    }
    post challenge_end_point, params: body.to_json, headers: authenticated_header(challenger)

    errors = JSON.parse(response.body)['errors']
    assert_equal 403, response.status
    assert errors.join.include? 'window not open'
  end

  test 'it returns a 403 when the user is challengeing someone of a different instrument' do
    performance = create(:performance)
    challenger = create(:alternate_user, :mellophone, :first, :spot_r13)
    create(:user, :trumpet, :first, :spot_a2)
    body = {
      challenge_type: 'normal',
      file: 2,
      row: 'a',
      performance_id: performance.id
    }
    post challenge_end_point, params: body.to_json, headers: authenticated_header(challenger)

    errors = JSON.parse(response.body)['errors']

    assert_equal 403, response.status
    assert errors.join.include? 'can\'t challenge someone of a different instrument or part'
  end

  test 'it returns a 403 when the user is challengeing someone of a different part' do
    performance = create(:performance)
    challenger = create(:alternate_user, :trumpet, :solo, :spot_a13)
    create(:user, :trumpet, :first, :spot_a2)
    body = {
      challenge_type: 'normal',
      file: 2,
      row: 'a',
      performance_id: performance.id
    }
    post challenge_end_point, params: body.to_json, headers: authenticated_header(challenger)

    errors = JSON.parse(response.body)['errors']

    assert_equal 403, response.status
    assert errors.join.include? 'can\'t challenge someone of a different instrument or part'
  end

  test 'it returns a 403 when trying to challenge an alternate\'s spot' do
    performance = create(:performance)
    challenger = create(:alternate_user, :trumpet, :solo, :spot_a13)
    create(:user, :trumpet, :solo, :spot_a2)
    body = {
      challenge_type: 'normal',
      file: 13,
      row: 'a',
      performance_id: performance.id
    }
    post challenge_end_point, params: body.to_json, headers: authenticated_header(challenger)

    errors = JSON.parse(response.body)['errors']
    assert_equal 403, response.status
    assert errors.join.include? 'can\'t challenge alternate'
  end

  test 'it returns a 403 when trying to create an open spot challenge on a spot that isn\'t open' do
    performance = create(:performance)
    challenger = create(:alternate_user, :mellophone, :first, :spot_r13)
    create(:user, :mellophone, :first, :spot_e2)
    body = {
      challenge_type: 'open_spot',
      file: 2,
      row: 'e',
      performance_id: performance.id
    }
    post challenge_end_point, params: body.to_json, headers: authenticated_header(challenger)

    errors = JSON.parse(response.body)['errors']
    assert_equal 403, response.status
    assert errors.join.include? 'can\'t make a challenge of type open_spot that is open'
  end

  test 'it returns a 403 when trying to create a tri challenge without enough users' do
    performance = create(:performance)
    challenger = create(:alternate_user, :percussion, :cymbals, :spot_j13)
    create(:user, :percussion, :cymbals, :spot_j3)
    body = {
      challenge_type: 'tri',
      file: 3,
      row: 'j',
      performance_id: performance.id
    }
    post challenge_end_point, params: body.to_json, headers: authenticated_header(challenger)

    errors = JSON.parse(response.body)['errors']
    assert_equal 403, response.status
    assert errors.join.include? 'not enough users for tri challenge'
  end

  test 'it returns a 403 when trying to challenge a non open spot twice' do
    performance = create(:performance)
    challenger = create(:alternate_user, :trumpet, :solo, :spot_a13)
    other_challenger = create(:alternate_user, :trumpet, :solo, :spot_a11)
    create(:user, :trumpet, :solo, :spot_a2)
    body = {
      challenge_type: 'normal',
      file: 2,
      row: 'a',
      performance_id: performance.id
    }
    post challenge_end_point, params: body.to_json, headers: authenticated_header(challenger)
    post challenge_end_point, params: body.to_json, headers: authenticated_header(other_challenger)

    errors = JSON.parse(response.body)['errors']
    assert_equal 403, response.status
    assert errors.join.include? 'spot has already been challenged'
  end

  test 'it returns a 403 when a user tries to make a second challenge' do
    performance = create(:performance)
    challenger = create(:alternate_user, :trumpet, :solo, :spot_a13)
    create(:user, :trumpet, :solo, :spot_a2)
    create(:user, :trumpet, :solo, :spot_a3)
    body = {
      challenge_type: 'normal',
      file: 2,
      row: 'a',
      performance_id: performance.id
    }
    other_body = {
      challenge_type: 'normal',
      file: 3,
      row: 'a',
      performance_id: performance.id
    }
    post challenge_end_point, params: body.to_json, headers: authenticated_header(challenger)
    post challenge_end_point, params: other_body.to_json, headers: authenticated_header(challenger)

    errors = JSON.parse(response.body)['errors']
    assert_equal 403, response.status
    assert errors.join.include? 'can\'t make more than one challenge'
  end

  test 'it adds user to challenge if a user tries to create a challenged, but not full open spot' do
    performance = create(:performance)
    challenger = create(:alternate_user, :mellophone, :first, :spot_r13)
    other_challenger = create(:alternate_user, :mellophone, :first, :spot_e13)
    challengee = create(:user, :mellophone, :first, :spot_e2)
    body = {
      challenge_type: 'open_spot',
      file: 2,
      row: 'e',
      performance_id: performance.id
    }
    other_body = {
      challenge_type: 'open_spot',
      file: 2,
      row: 'e',
      performance_id: performance.id
    }
    create(:discipline_action, user: challengee, open_spot: true, performance: performance)
    post challenge_end_point, params: body.to_json, headers: authenticated_header(challenger)
    post challenge_end_point, params: other_body.to_json, headers: authenticated_header(other_challenger)

    assert_equal 1, other_challenger.challenges.length
  end
end
