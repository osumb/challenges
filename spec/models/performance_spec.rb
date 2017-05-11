require 'rails_helper'

describe Performance, type: :model do
  subject { build(:performance) }

  it { is_expected.to validate_presence_of(:name) }
  it { is_expected.to validate_presence_of(:date) }
  it { is_expected.to validate_uniqueness_of(:date) }
  it { is_expected.to validate_presence_of(:window_open) }
  it { is_expected.to validate_uniqueness_of(:window_open) }
  it { is_expected.to validate_presence_of(:window_close) }
  it { is_expected.to validate_uniqueness_of(:window_close) }

  describe 'validations' do
    let(:performance) { build(:performance, window_open: window_open, window_close: window_close) }

    context 'when window_open is earlier than window_close' do
      let(:window_open) { Time.zone.now }
      let(:window_close) { Time.zone.now + 1.day }

      specify { expect(performance).to be_valid }
    end

    context 'when window_open is earlier than window_close' do
      let(:window_open) { Time.zone.now + 1.day }
      let(:window_close) { Time.zone.now }

      specify { expect(performance).not_to be_valid }
    end
  end

  describe '#window_open?' do
    let(:performance) { build(:performance, window_open: window_open, window_close: window_close) }

    context 'when the current time is within the window' do
      let(:window_open) { Time.zone.now - 1.day }
      let(:window_close) { Time.zone.now + 1.day }

      specify { expect(performance.window_open?).to be(true) }
    end

    context 'when the current time is not within the window' do
      let(:window_open) { Time.zone.now - 2.days }
      let(:window_close) { Time.zone.now - 1.day }

      specify { expect(performance.window_open?).to be(false) }
    end
  end
end
