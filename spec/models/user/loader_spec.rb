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
    it 'successfully creates the users' do
      expect { loader.create_users }.to change { User.count }.by(236)
    end

    it 'successfully creates the spots' do
      expect { loader.create_users }.to change { Spot.count }.by(228)
    end

    it 'has no errors' do
      loader.create_users
      expect(loader.errors.any?).to be(false)
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
