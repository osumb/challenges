require 'rails_helper'

shared_examples_for 'common row validations' do |row, instrument, parts|
  it 'only allows the correct parts' do
    select_user_parts(parts) do |_key, value|
      expect(Spot.valid_instrument_part_for_row(row, instrument, value)).to be(true)
    end
    reject_user_parts(parts) do |_key, value|
      expect(Spot.valid_instrument_part_for_row(row, instrument, value)).to be(false)
    end
  end

  it 'does not allow other instruments' do
    instruments = User.instruments.select { |i| User.instruments[i] != instrument }

    instruments.each do |_key, value|
      expect(Spot.valid_instrument_part_for_row(row, value, parts.first)).to be(false)
    end
  end
end

describe Spot, type: :model do
  subject(:spot) { build(:spot) }
  it { is_expected.to validate_presence_of(:row) }
  it { is_expected.to validate_presence_of(:file) }

  describe '#to_s' do
    specify { expect(spot.to_s).to eq("#{spot.row.upcase}#{spot.file}") }
  end

  describe 'validations' do
    context 'a row' do
      it_behaves_like 'common row validations',
                      Spot.rows[:a],
                      User.instruments[:trumpet],
                      [User.parts[:efer], User.parts[:solo], User.parts[:first]]
    end

    context 'x row' do
      it_behaves_like 'common row validations',
                      Spot.rows[:x],
                      User.instruments[:trumpet],
                      [User.parts[:efer], User.parts[:solo], User.parts[:first]]
    end

    context 'b row' do
      it_behaves_like 'common row validations',
                      Spot.rows[:b],
                      User.instruments[:trumpet],
                      [User.parts[:first], User.parts[:second]]
    end

    context 't row' do
      it_behaves_like 'common row validations',
                      Spot.rows[:t],
                      User.instruments[:trumpet],
                      [User.parts[:first], User.parts[:second]]
    end

    context 'c row' do
      it_behaves_like 'common row validations',
                      Spot.rows[:c],
                      User.instruments[:trumpet],
                      [User.parts[:flugel]]
    end

    context 'e row' do
      it_behaves_like 'common row validations',
                      Spot.rows[:e],
                      User.instruments[:mellophone],
                      [User.parts[:first], User.parts[:second]]
    end

    context 'r row' do
      it_behaves_like 'common row validations',
                      Spot.rows[:r],
                      User.instruments[:mellophone],
                      [User.parts[:first], User.parts[:second]]
    end

    context 'f row' do
      it_behaves_like 'common row validations',
                      Spot.rows[:f],
                      User.instruments[:trombone],
                      [User.parts[:first], User.parts[:second], User.parts[:bass]]
    end

    context 'q row' do
      it_behaves_like 'common row validations',
                      Spot.rows[:q],
                      User.instruments[:trombone],
                      [User.parts[:first], User.parts[:second], User.parts[:bass]]
    end

    context 'h row' do
      it_behaves_like 'common row validations',
                      Spot.rows[:h],
                      User.instruments[:baritone],
                      [User.parts[:first]]
    end

    context 'm row' do
      it_behaves_like 'common row validations',
                      Spot.rows[:m],
                      User.instruments[:baritone],
                      [User.parts[:first]]
    end

    context 'i row' do
      it_behaves_like 'common row validations',
                      Spot.rows[:i],
                      User.instruments[:percussion],
                      [User.parts[:snare]]
    end

    context 'j row' do
      it_behaves_like 'common row validations',
                      Spot.rows[:j],
                      User.instruments[:percussion],
                      [User.parts[:bass], User.parts[:cymbals], User.parts[:tenor]]
    end

    context 'k row' do
      it_behaves_like 'common row validations',
                      Spot.rows[:k],
                      User.instruments[:sousaphone],
                      [User.parts[:first]]
    end

    context 'l row' do
      it_behaves_like 'common row validations',
                      Spot.rows[:l],
                      User.instruments[:sousaphone],
                      [User.parts[:first]]
    end

    context 's row' do
      it_behaves_like 'common row validations',
                      Spot.rows[:s],
                      User.instruments[:trumpet],
                      [User.parts[:second], User.parts[:flugel]]
    end
  end
end
