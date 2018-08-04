class PasswordResetRequest < ApplicationRecord
  # associations
  belongs_to :user, foreign_key: "user_buck_id"

  # validations
  validate :can_not_reuse

  def expired?
    expires < Time.current
  end

  def used?
    used
  end

  private

  def can_not_reuse
    return unless used_changed? from: true, to: false
    errors.add :password_change_request, "can't be reused"
  end
end
