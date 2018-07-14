require 'rails_helper'

describe PerformanceService do
  describe '.create' do
    let(:name) { 'Test Performance' }
    let(:date) { 'Sat, 21 Jul 2018 12:00:00' }
    let(:window_open) { 'Mon, 16 Jul 2018 13:00:00' }
    let(:window_close) { 'Mon, 16 Jul 2018 16:14:00' }
    let(:client_timezone) { 'America/New_York' }

    it 'creates the performance' do
      result = described_class.create(name: name, date: date, window_open: window_open, window_close: window_close, client_timezone: client_timezone)

      expect(result).to be_a(Performance)
    end

    it 'converts the datetimes according to the client_timezone', :aggregate_failures do
      result = described_class.create(name: name, date: date, window_open: window_open, window_close: window_close, client_timezone: client_timezone)

      expected_date = Time.zone.parse(date)
      result_date = result.date.in_time_zone(client_timezone)
      expected_window_open = Time.zone.parse(window_open)
      result_window_open = result.window_open.in_time_zone(client_timezone)
      expected_window_close = Time.zone.parse(window_close)
      result_window_close = result.window_close.in_time_zone(client_timezone)

      expect(result_date.hour).to eq(expected_date.hour)
      expect(result_date.day).to eq(expected_date.day)
      expect(result_date.month).to eq(expected_date.month)
      expect(result_window_open.hour).to eq(expected_window_open.hour)
      expect(result_window_open.day).to eq(expected_window_open.day)
      expect(result_window_open.month).to eq(expected_window_open.month)
      expect(result_window_close.hour).to eq(expected_window_close.hour)
      expect(result_window_close.day).to eq(expected_window_close.day)
      expect(result_window_close.month).to eq(expected_window_close.month)
    end

    it 'saves the name correctly' do
      result = described_class.create(name: name, date: date, window_open: window_open, window_close: window_close, client_timezone: client_timezone)

      expect(result.name).to eq(name)
    end

    context 'when the timezone is bad', :aggregate_failures do
      it 'returns the error' do
        result = described_class.create(name: name, date: date, window_open: window_open, window_close: window_close, client_timezone: 'not a timezone')

        expect(result.valid?).to be(false)
        expect(result.errors.full_messages).to eq(['Invalid client timezone: not a timezone'])
      end
    end
  end

  describe '.queue_new_performance_emails' do
    let(:performance) { create(:performance) }
    let(:normal_user) { create(:user, :squad_leader) }
    let(:alternate_user) { create(:user, :alternate) }

    it 'emails the alternate' do
      expect(EmailJob).to receive(:perform_later)
        .with(klass: 'NewPerformanceMailer', method: 'new_performance_email', args: { performance_id: performance.id, email: alternate_user.email })

      described_class.queue_new_performance_emails(performance_id: performance.id)
    end

    it 'doesn\'t email the normal user' do
      expect(EmailJob).not_to receive(:perform_later)
        .with(klass: 'NewPerformanceMailer', method: 'new_performance_email', args: { performance_id: performance.id, email: normal_user.email })

      described_class.queue_new_performance_emails(performance_id: performance.id)
    end
  end
end
