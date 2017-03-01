require 'test_helper'

class ChallengeTest < ActiveSupport::TestCase
  test 'normal challenge must have 2 users' do
    challenge = build(:normal_challenge)
    challenge.users << build(:user)
    refute challenge.valid?
    assert challenge.errors.full_messages.include? 'Users only 2 users are allowed in a normal challenge'
    challenge.users << build(:user)
    challenge.valid?
    refute challenge.errors.full_messages.include? 'Users only 2 users are allowed in a normal challenge'
  end

  test 'open_spot challenge must have 2 users' do
    challenge = build(:open_spot_challenge)
    challenge.users << build(:user)
    refute challenge.valid?
    assert challenge.errors.full_messages.include? 'Users only 2 users are allowed in an open spot challenge'
    challenge.users << build(:user)
    challenge.valid?
    refute challenge.errors.full_messages.include? 'Users only 2 users are allowed in an open spot challenge'
  end

  test 'tri challenge must have 3 users' do
    challenge = build(:tri_challenge)
    challenge.users << build(:user)
    challenge.users << build(:user)
    refute challenge.valid?
    assert challenge.errors.full_messages.include? 'Users only 3 users are allowed in a tri challenge'
    challenge.users << build(:user)
    challenge.valid?
    refute challenge.errors.full_messages.include? 'Users only 3 users are allowed in a tri challenge'
  end

  test 'users in a challenge must have the same instrument and part' do
    challenge = build(:normal_challenge)
    challenge.users << build(:user, instrument: :trumpet, part: :solo)
    challenge.users << build(:user, instrument: :trumpet, part: :first)
    refute challenge.valid?
    assert challenge.errors.full_messages.include? 'Users must all have the same instrument and part'
  end

  test 'users in a challenge aren\'t admins or directors' do
    challenge = build(:normal_challenge)
    challenge.users << build(:admin)
    challenge.users << build(:user)
    refute challenge.valid?
    assert challenge.errors.full_messages.include? 'Users must all be non admin or director'
  end

  test 'users in a challenge must be unique' do
    challenge = build(:normal_challenge)
    user = build(:user)
    challenge.users = [user, user]
    refute challenge.valid?
    assert challenge.errors.full_messages.include? 'Users must be unique in a challenge'
  end
end
