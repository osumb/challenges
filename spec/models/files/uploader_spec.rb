require 'rails_helper'

describe Files::Uploader do
  describe '.temporarily_save_file' do
    let(:filename) { 'test_user_upload.xlsx' }
    let(:uploaded_file) { instance_double(ActionDispatch::Http::UploadedFile, original_filename: filename) }

    before do
      allow(File).to receive(:open).and_return(nil)
    end

    it 'returns the correct directory of the new file' do
      expect(described_class.temporarily_save_file(uploaded_file)).to eq(Rails.root.join('tmp', filename))
    end
  end

  describe '.remove_temporary_file' do
    let(:filename) { 'test_user_upload.xlsx' }

    before do
      allow(File).to receive(:delete).and_return(nil)
    end

    it 'deletes the file' do
      described_class.remove_temporary_file(filename)
      expect(File).to have_received(:delete)
    end
  end
end
