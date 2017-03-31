class Performance < ApplicationRecord
  # associations
  has_many :challenges
  has_many :discipline_actions

  # validations
  validates :name, presence: true
  validates :date, presence: true, uniqueness: true
  validates :window_open, presence: true, uniqueness: true
  validates :window_close, presence: true, uniqueness: true

  validate :window_open_before_window_close

  def self.next
    where('now() < window_close').order(window_open: :asc).first
  end

  def window_open?
    now = Time.zone.now
    window_open < now && now < window_close
  end

  private

  def window_open_before_window_close
    return if window_open.nil? || window_close.nil?
    return unless window_close < window_open
    errors.add(:window_close, 'must be later than window_open')
  end
end
