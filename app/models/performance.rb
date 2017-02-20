class Performance < ApplicationRecord
  # validations
  validates :name, presence: true
  validates :date, presence: true, uniqueness: true
  validates :window_open, presence: true, uniqueness: true
  validates :window_close, presence: true, uniqueness: true

  validate :window_open_before_window_close

  private

  def window_open_before_window_close
    return if window_open.nil? || window_close.nil?
    return true unless window_close < window_open
    errors.add(:window_close, 'must be later than window_open')
  end
end
