require 'test_helper'

# rubocop:disable Metrics/ClassLength
class SpotTest < ActiveSupport::TestCase
  test 'spot must have row' do
    spot = build(:spot, row: nil)
    refute spot.valid?
  end

  test 'spot must have file' do
    spot = build(:spot, file: nil)
    refute spot.valid?
  end

  test 'a and x rows should allow efer, solo, first trumpet parts' do
    a_row = Spot.rows[:a]
    x_row = Spot.rows[:x]
    instrument = User.instruments[:trumpet]
    parts = [User.parts[:efer], User.parts[:solo], User.parts[:first]]
    parts.each do |part|
      assert Spot.valid_instrument_part_for_row(a_row, instrument, part)
      assert Spot.valid_instrument_part_for_row(x_row, instrument, part)
    end
  end

  test 'a and x rows shouldn\'t allow non trumpets' do
    a_row = Spot.rows[:a]
    x_row = Spot.rows[:x]
    instruments = User.instruments.select { |i| User.instruments[i] != User.instruments[:trumpet] }
    part = User.parts[:first]
    instruments.each do |_key, value|
      refute Spot.valid_instrument_part_for_row(a_row, value, part)
      refute Spot.valid_instrument_part_for_row(x_row, value, part)
    end
  end

  test 'a and x rows shouldn\'t allow non efer, solo, first parts' do
    a_row = Spot.rows[:a]
    x_row = Spot.rows[:x]
    instruments = User.instruments[:trumpet]
    parts = User.parts.select do |p|
      ![User.parts[:efer], User.parts[:solo], User.parts[:first]].include? User.parts[p]
    end
    parts.each do |_key, p|
      refute Spot.valid_instrument_part_for_row(a_row, instruments, p)
      refute Spot.valid_instrument_part_for_row(x_row, instruments, p)
    end
  end

  test 'b and t rows should allow first, second trumpet parts' do
    b_row = Spot.rows[:b]
    t_row = Spot.rows[:t]
    instrument = User.instruments[:trumpet]
    parts = [User.parts[:first], User.parts[:second]]
    parts.each do |value|
      assert Spot.valid_instrument_part_for_row(b_row, instrument, value)
      assert Spot.valid_instrument_part_for_row(t_row, instrument, value)
    end
  end

  test 'b and t rows shouldn\'t allow non trumpets' do
    b_row = Spot.rows[:b]
    t_row = Spot.rows[:t]
    instruments = User.instruments.select { |i| User.instruments[i] != User.instruments[:trumpet] }
    part = User.parts[:first]
    instruments.each do |_key, value|
      refute Spot.valid_instrument_part_for_row(b_row, value, part)
      refute Spot.valid_instrument_part_for_row(t_row, value, part)
    end
  end

  test 'b and t rows shouldn\'t allow non first, second parts' do
    b_row = Spot.rows[:b]
    t_row = Spot.rows[:t]
    instruments = User.instruments[:trumpet]
    parts = User.parts.select do |p|
      ![User.parts[:first], User.parts[:second]].include? User.parts[p]
    end
    parts.each do |_key, value|
      refute Spot.valid_instrument_part_for_row(b_row, instruments, value)
      refute Spot.valid_instrument_part_for_row(t_row, instruments, value)
    end
  end

  test 'c row should allow flugel part' do
    c_row = Spot.rows[:c]
    instrument = User.instruments[:trumpet]
    parts = [User.parts[:flugel]]
    parts.each do |value|
      assert Spot.valid_instrument_part_for_row(c_row, instrument, value)
    end
  end

  test 'c row shouldn\'t allow non trumpets' do
    c_row = Spot.rows[:c]
    instruments = User.instruments.select { |i| User.instruments[i] != User.instruments[:trumpet] }
    part = User.parts[:flugel]
    instruments.each do |_key, value|
      refute Spot.valid_instrument_part_for_row(c_row, value, part)
    end
  end

  test 'c row shouldn\'t allow non flugel parts' do
    c_row = Spot.rows[:c]
    instruments = User.instruments[:trumpet]
    parts = User.parts.select do |p|
      ![User.parts[:flugel]].include? User.parts[p]
    end
    parts.each do |_key, value|
      refute Spot.valid_instrument_part_for_row(c_row, instruments, value)
    end
  end

  test 'e and r rows should allow first, second mellophone parts' do
    e_row = Spot.rows[:e]
    r_row = Spot.rows[:r]
    instrument = User.instruments[:mellophone]
    parts = [User.parts[:first], User.parts[:second]]
    parts.each do |value|
      assert Spot.valid_instrument_part_for_row(e_row, instrument, value)
      assert Spot.valid_instrument_part_for_row(r_row, instrument, value)
    end
  end

  test 'e and r rows shouldn\'t allow non mellophones' do
    e_row = Spot.rows[:e]
    r_row = Spot.rows[:r]
    instruments = User.instruments.select { |i| User.instruments[i] != User.instruments[:mellophone] }
    part = User.parts[:first]
    instruments.each do |_key, value|
      refute Spot.valid_instrument_part_for_row(e_row, value, part)
      refute Spot.valid_instrument_part_for_row(r_row, value, part)
    end
  end

  test 'e and r rows shouldn\'t allow non first, second parts' do
    e_row = Spot.rows[:e]
    r_row = Spot.rows[:r]
    instruments = User.instruments[:mellophone]
    parts = User.parts.select do |p|
      ![User.parts[:first], User.parts[:second]].include? User.parts[p]
    end
    parts.each do |_key, value|
      refute Spot.valid_instrument_part_for_row(e_row, instruments, value)
      refute Spot.valid_instrument_part_for_row(r_row, instruments, value)
    end
  end

  test 'f and q rows should allow first, second, and bass trombone parts' do
    f_row = Spot.rows[:f]
    q_row = Spot.rows[:q]
    instrument = User.instruments[:trombone]
    parts = [User.parts[:first], User.parts[:second], User.parts[:bass]]
    parts.each do |value|
      assert Spot.valid_instrument_part_for_row(f_row, instrument, value)
      assert Spot.valid_instrument_part_for_row(q_row, instrument, value)
    end
  end

  test 'f and q rows shouldn\'t allow non trombones' do
    f_row = Spot.rows[:f]
    q_row = Spot.rows[:q]
    instruments = User.instruments.select { |i| User.instruments[i] != User.instruments[:trombone] }
    part = User.parts[:first]
    instruments.each do |_key, value|
      refute Spot.valid_instrument_part_for_row(f_row, value, part)
      refute Spot.valid_instrument_part_for_row(q_row, value, part)
    end
  end

  test 'f and q rows shouldn\'t allow non first, second, and bass parts' do
    f_row = Spot.rows[:f]
    q_row = Spot.rows[:q]
    instruments = User.instruments[:trombone]
    parts = User.parts.select do |p|
      ![User.parts[:first], User.parts[:second], User.parts[:bass]].include? User.parts[p]
    end
    parts.each do |_key, value|
      refute Spot.valid_instrument_part_for_row(f_row, instruments, value)
      refute Spot.valid_instrument_part_for_row(q_row, instruments, value)
    end
  end

  test 'h and m rows should allow the first baritone part' do
    h_row = Spot.rows[:h]
    m_row = Spot.rows[:m]
    instrument = User.instruments[:baritone]
    parts = [User.parts[:first]]
    parts.each do |value|
      assert Spot.valid_instrument_part_for_row(h_row, instrument, value)
      assert Spot.valid_instrument_part_for_row(m_row, instrument, value)
    end
  end

  test 'h and m rows shouldn\'t allow non baritones' do
    h_row = Spot.rows[:h]
    m_row = Spot.rows[:m]
    instruments = User.instruments.select { |i| User.instruments[i] != User.instruments[:baritone] }
    part = User.parts[:first]
    instruments.each do |_key, value|
      refute Spot.valid_instrument_part_for_row(h_row, value, part)
      refute Spot.valid_instrument_part_for_row(m_row, value, part)
    end
  end

  test 'h and m rows shouldn\'t allow non first parts' do
    h_row = Spot.rows[:h]
    m_row = Spot.rows[:m]
    instruments = User.instruments[:baritone]
    parts = User.parts.select do |p|
      ![User.parts[:first]].include? User.parts[p]
    end
    parts.each do |_key, value|
      refute Spot.valid_instrument_part_for_row(h_row, instruments, value)
      refute Spot.valid_instrument_part_for_row(m_row, instruments, value)
    end
  end

  test 'i row should allow snare part' do
    i_row = Spot.rows[:i]
    instrument = User.instruments[:percussion]
    parts = [User.parts[:snare]]
    parts.each do |value|
      assert Spot.valid_instrument_part_for_row(i_row, instrument, value)
    end
  end

  test 'i row shouldn\'t allow non percussion' do
    i_row = Spot.rows[:i]
    instruments = User.instruments.select { |i| User.instruments[i] != User.instruments[:percussion] }
    part = User.parts[:snare]
    instruments.each do |_key, value|
      refute Spot.valid_instrument_part_for_row(i_row, value, part)
    end
  end

  test 'i row shouldn\'t allow non snare parts' do
    i_row = Spot.rows[:i]
    instruments = User.instruments[:percussion]
    parts = User.parts.select do |p|
      ![User.parts[:snare]].include? User.parts[p]
    end
    parts.each do |_key, value|
      refute Spot.valid_instrument_part_for_row(i_row, instruments, value)
    end
  end

  test 'j row should allow bass, cymbals, and tenor parts' do
    j_row = Spot.rows[:j]
    instrument = User.instruments[:percussion]
    parts = [User.parts[:bass], User.parts[:cymbals], User.parts[:tenor]]
    parts.each do |value|
      assert Spot.valid_instrument_part_for_row(j_row, instrument, value)
    end
  end

  test 'j row shouldn\'t allow non percussion' do
    j_row = Spot.rows[:j]
    instruments = User.instruments.select { |i| User.instruments[i] != User.instruments[:percussion] }
    part = User.parts[:bass]
    instruments.each do |_key, value|
      refute Spot.valid_instrument_part_for_row(j_row, value, part)
    end
  end

  test 'j row shouldn\'t allow non bass, cymbals, and tenor parts' do
    j_row = Spot.rows[:j]
    instruments = User.instruments[:percussion]
    parts = User.parts.select do |p|
      ![User.parts[:bass], User.parts[:cymbals], User.parts[:tenor]].include? User.parts[p]
    end
    parts.each do |_key, value|
      refute Spot.valid_instrument_part_for_row(j_row, instruments, value)
    end
  end

  test 'k and l rows should allow the first baritone part' do
    k_row = Spot.rows[:k]
    l_row = Spot.rows[:l]
    instrument = User.instruments[:sousaphone]
    parts = [User.parts[:first]]
    parts.each do |value|
      assert Spot.valid_instrument_part_for_row(k_row, instrument, value)
      assert Spot.valid_instrument_part_for_row(l_row, instrument, value)
    end
  end

  test 'k and l rows shouldn\'t allow non sousaphones' do
    k_row = Spot.rows[:k]
    l_row = Spot.rows[:l]
    instruments = User.instruments.select { |i| User.instruments[i] != User.instruments[:sousaphone] }
    part = User.parts[:first]
    instruments.each do |_key, value|
      refute Spot.valid_instrument_part_for_row(k_row, value, part)
      refute Spot.valid_instrument_part_for_row(l_row, value, part)
    end
  end

  test 'k and l rows shouldn\'t allow non first parts' do
    k_row = Spot.rows[:k]
    l_row = Spot.rows[:l]
    instruments = User.instruments[:sousaphone]
    parts = User.parts.select do |p|
      ![User.parts[:first]].include? User.parts[p]
    end
    parts.each do |_key, value|
      refute Spot.valid_instrument_part_for_row(k_row, instruments, value)
      refute Spot.valid_instrument_part_for_row(l_row, instruments, value)
    end
  end

  test 's row should allow second and flugel parts' do
    s_row = Spot.rows[:s]
    instrument = User.instruments[:trumpet]
    parts = [User.parts[:second], User.parts[:flugel]]
    parts.each do |value|
      assert Spot.valid_instrument_part_for_row(s_row, instrument, value)
    end
  end

  test 's row shouldn\'t allow non trumpet' do
    s_row = Spot.rows[:s]
    instruments = User.instruments.select { |i| User.instruments[i] != User.instruments[:trumpet] }
    part = User.parts[:second]
    instruments.each do |_key, value|
      refute Spot.valid_instrument_part_for_row(s_row, value, part)
    end
  end

  test 's row shouldn\'t allow non second or flugel parts' do
    s_row = Spot.rows[:s]
    instruments = User.instruments[:trumpet]
    parts = User.parts.select do |p|
      ![User.parts[:second], User.parts[:flugel]].include? User.parts[p]
    end
    parts.each do |_key, value|
      refute Spot.valid_instrument_part_for_row(s_row, instruments, value)
    end
  end
end
