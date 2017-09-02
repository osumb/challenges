require 'rails_helper'

describe 'User Upload', type: :request do
  let(:endpoint) { '/api/users/upload' }
  let(:request) { post endpoint, params: { file: file }, headers: authenticated_file_upload_headers(admin) }
  let(:errors) { instance_double(ActiveModel::Errors, any?: !was_successful_create, messages: {})}
  let(:filename) { Rails.root.join('spec', 'fixtures', 'test_user_upload.xlsx').to_s }
  let(:new_filename) { Rails.root.join('public', 'uploads', 'test_user_upload.xlsx').to_s }
  let(:mime_type) { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
  let(:file) { Rack::Test::UploadedFile.new(filename, mime_type) }
  let(:loader) { instance_double(User::Loader, create_users: nil, email_users: nil, errors: errors) }
  let(:admin) { create(:admin_user) }

  describe 'POST /api/users/upload' do
    let(:was_successful_create) { true }

    before do
      allow(Files::Uploader).to receive(:temporarily_save_file).and_return(new_filename)
      allow(Files::Uploader).to receive(:remove_temporary_file).with(new_filename)
      allow(User::Loader).to receive(:new).with(file: new_filename).and_return(loader)
      request
    end

    it 'saves the file temporarily' do
      expect(Files::Uploader).to have_received(:temporarily_save_file)
    end

    it 'attempts to create the users' do
      expect(loader).to have_received(:create_users)
    end

    it 'cleans the saved file' do
      expect(Files::Uploader).to have_received(:remove_temporary_file)
    end

    it 'emails the users if the loader successfully loads the users' do
      expect(loader).to have_received(:email_users)
    end

    context 'when the creation is not successful' do
      let(:was_successful_create) { false }

      it 'emails the users if the loader successfully loads the users' do
        expect(loader).not_to have_received(:email_users)
      end
    end
  end
end
