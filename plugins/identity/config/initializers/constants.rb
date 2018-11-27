ALLOWED_ROLES = %w[
  admin
  audit_viewer
  automation_admin
  automation_viewer
  compute_admin
  compute_viewer
  dns_viewer
  dns_webmaster
  keymanager_admin
  keymanager_viewer
  kubernetes_admin
  kubernetes_member
  member
  monitoring_viewer
  network_admin
  network_viewer
  resource_admin
  resource_viewer
  sharedfilesystem_admin
  sharedfilesystem_viewer
  swiftoperator
  volume_admin
  volume_viewer
].freeze

BETA_ROLES = %w[
].freeze

# not even cloud admins are allowed to assign these, they're intentionally
# restricted to a few technical users (and those assignments are maintained in
# helm-charts)
BLACKLISTED_ROLES = %w[
  resource_service
  swiftreseller
].freeze
