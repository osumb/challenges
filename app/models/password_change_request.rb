class PasswordChangeRequest < ApplicationRecord
  # associations
  belongs_to :user

  # validations
  validate :can_not_reuse

  private

  def can_not_reuse
    return unless used_changed? from: true, to: false
    errors.add :password_change_request, "can't be reused"
  end
end
