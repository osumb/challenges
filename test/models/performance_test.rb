require 'test_helper'

class PerformanceTest < ActiveSupport::TestCase
  test 'performance must have name' do
    performance = build(:performance, name: nil)
    refute performance.valid?
  end

  test 'performance must have date' do
    performance = build(:performance, date: nil)
    refute performance.valid?
  end

  test 'performance date must be unique' do
    date = Time.zone.now
    create(:performance, date: date)
    performance = build(:performance, date: date)
    refute performance.valid?
  end

  test 'performance must have window_open' do
    performance = build(:performance, window_open: nil, window_close: Time.zone.now)
    refute performance.valid?
  end

  test 'performance window_open must be unique' do
    date = Time.zone.now
    create(:performance, window_open: date)
    performance = build(:performance, window_open: date)
    refute performance.valid?
  end

  test 'performance must have window_close' do
    performance = build(:performance, window_close: nil)
    refute performance.valid?
  end

  test 'performance window_close must be unique' do
    date = Time.zone.now + 1.day
    create(:performance, window_close: date)
    performance = build(:performance, window_close: date)
    refute performance.valid?
  end

  test 'window_open must be earlier window_close' do
    performance = build(:performance, window_open: Time.zone.now, window_close: Time.zone.now - 1.day)
    refute performance.valid?
    assert_equal 'Window close must be later than window_open', performance.errors.full_messages.join
  end

  test 'performance window returns true with the window is open' do
    performance = build(:performance, window_open: Time.zone.now, window_close: Time.zone.now + 1.day)
    assert performance.window_open?
  end

  test 'performance window returns false with the window is closed' do
    performance = build(:performance, window_open: Time.zone.now - 1.day, window_close: Time.zone.now)
    refute performance.window_open?
  end
end
