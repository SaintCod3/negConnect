class Api::V1::RequestTypesController < Api::V1::BaseController
  def index
    respond_with RequestType.all
  end

  def create
    @request_type = RequestType.create(request_types_params)
    respond_with :api, :v1, @request_type, location: -> { api_v1_request_types_url(@request_type) }
  end

  def destroy
    respond_with RequestType.destroy(params[:id])
  end

  def update
    request_type = RequestType.find(params["id"])
    request_type.update_attributes(request_type_params)
    respond_with request_types, json: request_types
  end

  private

  def request_types_params
    params.require(:request_type).permit(:id, :name)
  end
end