package v1alpha1

import "strings"

// GroupVersionString returns a string representation of the group and
// API Version, e.g. meta.sensu.io/v1alpha1
func (gv GroupVersion) GroupVersionString() string {
	return strings.Join([]string{gv.Group, gv.Version}, "/")
}
