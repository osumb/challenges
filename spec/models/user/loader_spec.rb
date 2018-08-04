require "rails_helper"

describe User::Loader, type: :model do
  subject(:loader) { described_class.new(file: filename) }
  let(:filename) { Rails.root.join("spec", "fixtures", "test_user_upload.xlsx") }
  let(:worksheet) { instance_double(RubyXL::Worksheet, :[] => []) }
  let(:workbook) { instance_double(RubyXL::Workbook, :[] => [worksheet]) }

  describe ".new" do
    before do
      allow(RubyXL::Parser).to receive(:parse).with(filename).and_return(workbook)
    end

    it "opens the file for parsing" do
      loader
      expect(RubyXL::Parser).to have_received(:parse)
    end
  end

  describe "#create_user" do
    let!(:non_admin_user) { create(:user, role: :member) }
    let!(:admin_user) { create(:admin_user) }

    before do
      allow(Challenge).to receive(:destroy_all).and_call_original
      allow(UserChallenge).to receive(:destroy_all).and_call_original
      allow(PasswordResetRequest).to receive(:destroy_all).and_call_original
      allow(DisciplineAction).to receive(:destroy_all).and_call_original
      allow(Performance).to receive(:destroy_all).and_call_original
      allow(Spot).to receive(:destroy_all).and_call_original
    end

    it "has no errors" do
      loader.create_users
      expect(loader.errors.any?).to be(false)
    end

    it "does not clear the admin users" do
      loader.create_users
      expect(User.find_by(buck_id: admin_user.buck_id)).not_to be_nil
    end

    it "clears the non-admin users" do
      loader.create_users
      expect(User.find_by(buck_id: non_admin_user.buck_id)).to be_nil
    end

    it "clears the other models" do
      loader.create_users
      expect(Challenge).to have_received(:destroy_all)
      expect(UserChallenge).to have_received(:destroy_all)
      expect(PasswordResetRequest).to have_received(:destroy_all)
      expect(DisciplineAction).to have_received(:destroy_all)
      expect(Performance).to have_received(:destroy_all)
      expect(Spot).to have_received(:destroy_all)
    end
  end

  describe "#email_users" do
    let(:password) { "password" }
    let(:mail) { instance_double(ActionMailer::MessageDelivery, deliver_now: nil) }
    let(:user) { create(:user, password: password, password_confirmation: password) }

    before do
      allow(loader).to receive(:users).and_return([user])
      allow(PasswordResetMailer).to receive(:user_creation_email).and_return(nil)
      allow(RubyXL::Parser).to receive(:parse).with(filename).and_return(workbook)
      allow(PasswordResetMailer).to receive(:user_creation_email).and_return(mail)
      allow(PasswordResetRequest).to receive(:create).and_call_original
    end

    context "when there are no errors" do
      it "creates password reset requests for the users" do
        loader.email_users
        expect(PasswordResetRequest).to have_received(:create)
      end

      it "email the users" do
        loader.email_users
        expect(PasswordResetMailer).to have_received(:user_creation_email)
      end
    end

    context "when the password reset request has errors" do
      let(:bad_reset_request) { instance_double(PasswordResetRequest, valid?: false) }

      before do
        allow(PasswordResetRequest).to receive(:create).and_return(bad_reset_request)
        allow(Rails.logger).to receive(:info).and_call_original
      end

      it "logs that there was an error" do
        loader.email_users
        expect(Rails.logger).to have_received(:info).with(include(user.buck_id))
      end
    end

    context "when there are errors" do
      let(:errors) { instance_double(ActiveModel::Errors, any?: true) }

      before do
        allow(loader).to receive(:errors).and_return(errors)
      end

      it "does not email the users" do
        loader.email_users
        expect(PasswordResetMailer).not_to have_received(:user_creation_email)
      end
    end
  end
end
