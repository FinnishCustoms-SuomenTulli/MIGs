<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html"/>
	<xsl:param name="language"/>
	<xsl:param name="messageType"/>
	<xsl:key name="filterDefinitions" match="CodeLists/Definitions/Filter" use="Name"/>
	<xsl:template match="/">
		<xsl:for-each select="CodeLists/CodeList">
			<div class="modal fade" tabindex="-1" role="dialog" data-keyboard="false">
				<xsl:attribute name="id">
					<xsl:value-of select="Identification"/>
				</xsl:attribute>
				<div class="modal-dialog modal-xl" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<h1 class="modal-title">
								<xsl:value-of select="Identification"/>
							</h1>
						</div>
						<div class="modal-body">
							<xsl:attribute name="id">
								<xsl:value-of select="concat(Identification, '_content')"/>
							</xsl:attribute>
						</div>
					</div>
				</div>
			</div>
		</xsl:for-each>
	</xsl:template>
</xsl:stylesheet>