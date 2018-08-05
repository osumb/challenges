require "rails_helper"

describe UserService do
  describe ".deactivate_user" do
    let(:user) { create(:user, :active) }

    it "deactivates a user" do
      result = described_class.deactivate_user(buck_id: user.buck_id)

      expect(result.valid?).to be(true)
      expect(result.active?).to be(false)
    end

    it "removes the current spot and original spot relations" do
      result = described_class.deactivate_user(buck_id: user.buck_id)

      expect(result.current_spot).to be_nil
      expect(result.original_spot).to be_nil
    end
  end
end
