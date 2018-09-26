package v2alpha1

import (
	meta "github.com/sensu/sensu-go/apis/meta/v1alpha1"
)

var (
	// SchemeGroupVersion is the GroupVersion for this API Scheme.
	SchemeGroupVersion = meta.GroupVersion{
		Group:   "rbac.sensu.io",
		Version: "v1alpha1",
	}
)
