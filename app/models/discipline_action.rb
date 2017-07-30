class DisciplineAction < ApplicationRecord
  # associations
  belongs_to :user, foreign_key: 'user_buck_id'
  belongs_to :performance

  # validations
  validates :reason, presence: true
  validates :open_spot, inclusion: { in: [true, false] }
  validates :allowed_to_challenge, inclusion: { in: [true, false] }
end
