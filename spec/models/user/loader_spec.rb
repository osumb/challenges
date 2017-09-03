require 'rails_helper'

describe User::Loader, type: :model do
  subject(:loader) { described_class.new(file: filename) }
  let(:filename) { Rails.root.join('spec', 'fixtures', 'test_user_upload.xlsx') }
  let(:worksheet) { instance_double(RubyXL::Worksheet, :[] => []) }
  let(:workbook) { instance_double(RubyXL::Workbook, :[] => [worksheet]) }

  describe '.new' do
    before do
      allow(RubyXL::Parser).to receive(:parse).with(filename).and_return(workbook)
    end

    it 'opens the file for parsing' do
      loader
      expect(RubyXL::Parser).to have_received(:parse)
    end
  end

  describe '#create_user' do
    let!(:non_admin_user) { create(:user, role: :member) }
    let!(:admin_user) { create(:admin_user) }

    before do
      allow(Challenge).to receive(:destroy_all).and_return(nil)
      allow(UserChallenge).to receive(:destroy_all).and_return(nil)
      allow(PasswordResetRequest).to receive(:destroy_all).and_return(nil)
      allow(DisciplineAction).to receive(:destroy_all).and_return(nil)
      allow(Performance).to receive(:destroy_all).and_return(nil)
      allow(Spot).to receive(:destroy_all).and_return(nil)
    end

    it 'has no errors' do
      loader.create_users
      expect(loader.errors.any?).to be(false)
    end

    it 'does not clear the admin users' do
      loader.create_users
      expect(User.find_by(buck_id: admin_user.buck_id)).not_to be_nil
    end

    it 'clears the non-admin users' do
      loader.create_users
      expect(User.find_by(buck_id: non_admin_user.buck_id)).to be_nil
    end

    it 'clears the other models' do
      loader.create_users
      expect(Challenge).to have_received(:destroy_all)
      expect(UserChallenge).to have_received(:destroy_all)
      expect(PasswordResetRequest).to have_received(:destroy_all)
      expect(DisciplineAction).to have_received(:destroy_all)
      expect(Performance).to have_received(:destroy_all)
      expect(Spot).to have_received(:destroy_all)
    end
  end

  describe '#email_users' do
    let(:password) { 'password' }
    let(:user) { create(:user, password: password, password_confirmation: password) }

    before do
      allow(loader).to receive(:users_and_passwords).and_return([[user, password]])
      allow(UserPasswordMailer).to receive(:user_password_email).and_return(nil)
      allow(RubyXL::Parser).to receive(:parse).with(filename).and_return(workbook)
    end

    context 'when there are no errors' do
      it 'email the users' do
        loader.email_users
        expect(UserPasswordMailer).to have_received(:user_password_email)
      end
    end

    context 'when there are errors' do
      let(:errors) { instance_double(ActiveModel::Errors, any?: true) }

      before do
        allow(loader).to receive(:errors).and_return(errors)
      end

      it 'does not email the users' do
        loader.email_users
        expect(UserPasswordMailer).not_to have_received(:user_password_email)
      end
    end
  end
end
