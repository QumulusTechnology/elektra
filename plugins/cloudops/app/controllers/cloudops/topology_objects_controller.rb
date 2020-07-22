module Cloudops
  class TopologyObjectsController < ApplicationController
    def index
      object_topology = {}
      object = ObjectCache.where(id: params[:topology_object_id]).first
      if object
        object_topology['id'] = object.id
        object_topology['name'] = object.name

        query = 'project_id ILIKE :term OR domain_id ILIKE :term OR search_label ILIKE :term'
        if ENV['DB_TYPE'] == 'mysql'
          query = 'project_id LIKE :term OR domain_id LIKE :term OR search_label LIKE :term'
        end

        children = ObjectCache.where.not(cached_object_type: ['error','message']).where(
          [
            query,
            term: "%#{object.id}%"
          ]
        )
        object_topology['children'] = children
      end

      # objects = [
      #   {
      #     "name" => "10.10.10.10",
      #     "size" => 3938,
      #     'id' => '123456789'
      #   }, {
      #     "name" => "10.10.10.11",
      #     "size" => 3812,
      #     'id' => '1234567810'
      #   }, {
      #     "name" => "10.10.10.12",
      #     "size" => 6714,
      #     'id' => '1234567811'
      #   }, {
      #     "name" => "10.10.10.13",
      #     "size" => 743,
      #     'id' => '1234567812'
      #   }
      # ]

      #render json: ObjectCache.where(cached_object_type: 'project')
      render json: object_topology
    end
  end
end
