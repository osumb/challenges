require "rails_helper"

RSpec.describe PasswordService do
  let(:password) { "this is my super kool password" }
  let(:user) { create(:user) }
  let(:password_reset_request) { create(:password_reset_request, user: user) }
  let(:password_digest) { described_class.encrypt_password(password: password) }

  describe ".reset_password" do
    it "resets the user's password" do
      described_class.reset_password(password_reset_request_id: password_reset_request.id, password_digest: password_digest)

      user.reload

      expect(user.password_digest).to eq(password_digest)
    end

    it "flags the reset request as used" do
      described_class.reset_password(password_reset_request_id: password_reset_request.id, password_digest: password_digest)

      password_reset_request.reload

      expect(password_reset_request.used).to be(true)
    end
  end

  describe ".encrypt_password" do
    it "doesn't blow up" do
      described_class.encrypt_password(password: password)
    end
  end
end
