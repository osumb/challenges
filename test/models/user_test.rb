require 'test_helper'
# rubocop:disable Metrics/ClassLength
class UserTest < ActiveSupport::TestCase
  test 'user must have a first name' do
    user = build(:user, first_name: nil)
    refute user.valid?
    assert_equal 'First name can\'t be blank', user.errors.full_messages.join
  end

  test 'user must have a last name' do
    user = build(:user, last_name: nil)
    refute user.valid?
    assert_equal 'Last name can\'t be blank', user.errors.full_messages.join
  end

  test 'user must have an email' do
    user = build(:user, email: nil)
    refute user.valid?
    assert_equal 'Email can\'t be blank', user.errors.full_messages.join
  end

  test 'user must have a buck_id' do
    user = build(:user, buck_id: nil)
    refute user.valid?
    assert 'Buck id can\'t be blank', user.errors.full_messages.join
  end

  test 'user must have an instrument' do
    user = build(:user, instrument: nil)
    refute user.valid?
    assert_equal 'Instrument can\'t be blank', user.errors.full_messages.join
  end

  test 'user must have a part' do
    user = build(:user, part: nil)
    refute user.valid?
    assert_equal 'Part can\'t be blank', user.errors.full_messages.join
  end

  test 'user must have a role' do
    user = build(:user, role: nil)
    refute user.valid?
    assert_equal 'Role can\'t be blank', user.errors.full_messages.join
  end

  test 'non admin user must have a spot id' do
    user = build(:user, spot: nil)
    refute user.valid?
    assert_equal 'Spot can\'t be blank', user.errors.full_messages.join
  end

  test 'admin can\'t have a spot' do
    user = build(:admin, spot: build(:spot))
    refute user.valid?
    assert_equal 'Role admin or director can\'t have a spot', user.errors.full_messages.join
  end

  test 'admin with instrument any can have all parts' do
    User.parts.each do |key, _value|
      user = build(:admin, instrument: User.instruments[:any], part: User.parts[key])
      assert user.valid?
    end
  end

  test 'admin with instrument trumpet can have any, efer, solo, first, second, and flugel parts' do
    trumpet_parts = [
      User.parts[:any],
      User.parts[:efer],
      User.parts[:solo],
      User.parts[:first],
      User.parts[:second],
      User.parts[:flugel]
    ]
    User.parts.select { |_key, value| trumpet_parts.include? value }.each do |key, _value|
      user = build(:admin, instrument: User.instruments[:trumpet], part: User.parts[key])
      assert user.valid?
    end
    User.parts.reject { |_key, value| trumpet_parts.include? value }.each do |key, _value|
      user = build(:admin, instrument: User.instruments[:trumpet], part: User.parts[key])
      refute user.valid?
      assert_equal "Admin with instrument trumpet can't have part #{key}", user.errors.full_messages.join
    end
  end

  test 'admin with instrument mellophone can have any, first, and second parts' do
    mellophone_parts = [
      User.parts[:any],
      User.parts[:first],
      User.parts[:second]
    ]
    User.parts.select { |_key, value| mellophone_parts.include? value }.each do |key, _value|
      user = build(:admin, instrument: User.instruments[:mellophone], part: User.parts[key])
      assert user.valid?
    end
    User.parts.reject { |_key, value| mellophone_parts.include? value }.each do |key, _value|
      user = build(:admin, instrument: User.instruments[:mellophone], part: User.parts[key])
      refute user.valid?
      assert_equal "Admin with instrument mellophone can't have part #{key}", user.errors.full_messages.join
    end
  end

  test 'admin with instrument trombone can have any, first, second, and bass parts' do
    trombone_parts = [
      User.parts[:any],
      User.parts[:first],
      User.parts[:second],
      User.parts[:bass]
    ]
    User.parts.select { |_key, value| trombone_parts.include? value }.each do |key, _value|
      user = build(:admin, instrument: User.instruments[:trombone], part: User.parts[key])
      assert user.valid?
    end
    User.parts.reject { |_key, value| trombone_parts.include? value }.each do |key, _value|
      user = build(:admin, instrument: User.instruments[:trombone], part: User.parts[key])
      refute user.valid?
      assert_equal "Admin with instrument trombone can't have part #{key}", user.errors.full_messages.join
    end
  end

  test 'admin with instrument baritone can have any and first parts' do
    baritone_parts = [
      User.parts[:any],
      User.parts[:first]
    ]
    User.parts.select { |_key, value| baritone_parts.include? value }.each do |key, _value|
      user = build(:admin, instrument: User.instruments[:baritone], part: User.parts[key])
      assert user.valid?
    end
    User.parts.reject { |_key, value| baritone_parts.include? value }.each do |key, _value|
      user = build(:admin, instrument: User.instruments[:baritone], part: User.parts[key])
      refute user.valid?
      assert_equal "Admin with instrument baritone can't have part #{key}", user.errors.full_messages.join
    end
  end

  test 'admin with instrument percussion can have any, snare, cymbals, tenor, and bass parts' do
    percussion_parts = [
      User.parts[:any],
      User.parts[:snare],
      User.parts[:cymbals],
      User.parts[:tenor],
      User.parts[:bass]
    ]
    User.parts.select { |_key, value| percussion_parts.include? value }.each do |key, _value|
      user = build(:admin, instrument: User.instruments[:percussion], part: User.parts[key])
      assert user.valid?
    end
    User.parts.reject { |_key, value| percussion_parts.include? value }.each do |key, _value|
      user = build(:admin, instrument: User.instruments[:percussion], part: User.parts[key])
      refute user.valid?
      assert_equal "Admin with instrument percussion can't have part #{key}", user.errors.full_messages.join
    end
  end

  test 'admin with instrument sousaphone can have any and first parts' do
    sousaphone_parts = [
      User.parts[:any],
      User.parts[:first]
    ]
    User.parts.select { |_key, value| sousaphone_parts.include? value }.each do |key, _value|
      user = build(:admin, instrument: User.instruments[:sousaphone], part: User.parts[key])
      assert user.valid?
    end
    User.parts.reject { |_key, value| sousaphone_parts.include? value }.each do |key, _value|
      user = build(:admin, instrument: User.instruments[:sousaphone], part: User.parts[key])
      refute user.valid?
      assert_equal "Admin with instrument sousaphone can't have part #{key}", user.errors.full_messages.join
    end
  end

  test 'two users can\'t have the same spot' do
    user_a = create(:user)
    user_b = build(:user, spot: user_a.spot, email: user_a.email + '1', buck_id: user_a.buck_id + '1')
    refute user_b.valid?
    assert_equal 'Spot has already been taken', user_b.errors.full_messages.join
  end
end
