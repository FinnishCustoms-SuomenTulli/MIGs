<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html"/>
	<xsl:variable name="language">sv</xsl:variable>
	<xsl:template match="/">
		<xsl:for-each select="CodeLists/CodeList">
			<div class="modal fade" tabindex="-1" role="dialog" data-keyboard="false">
				<xsl:attribute name="id"><xsl:value-of select="concat('CODELIST_',Identification)"/></xsl:attribute>
				<div class="modal-dialog modal-lg" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<h1 class="modal-title">
								<xsl:value-of select="Identification"/>
							</h1>
						</div>
						<div class="modal-body">
							<p>
								<xsl:value-of select="Description[@lang=($language)]"/>
							</p>
							<table class="table table-striped table-hover table-responsive table-condensed">
								<thead>
									<tr>
										<xsl:choose>
											<xsl:when test="$language='fi'">
												<th>Koodi</th>
												<th>Nimi</th>
												<xsl:if test="count(CodeItem/Description[@lang=($language)][string(.)]) > 0">
													<th>Selite</th>
												</xsl:if>
											</xsl:when>
											<xsl:when test="$language='sv'">
												<th>Kod</th>
												<th>Namn</th>
												<xsl:if test="count(CodeItem/Description[@lang=($language)][string(.)]) > 0">
													<th>Förklaring</th>
												</xsl:if>
											</xsl:when>
											<xsl:when test="$language='en'">
												<th>Code</th>
												<th>Name</th>
												<xsl:if test="count(CodeItem/Description[@lang=($language)][string(.)]) > 0">
													<th>Description</th>
												</xsl:if>
											</xsl:when>
										</xsl:choose>
									</tr>
								</thead>
								<xsl:for-each select="CodeItem">
									<xsl:if test="Valid!='False'">
										<tr>
											<td>
												<!--span class="icon icon-tulli-info" style="margin-right:3px"></span-->
												<xsl:value-of select="Code"/>
											</td>
											<td>
												<xsl:value-of select="Name[@lang=($language)]"/>
											</td>
											<xsl:if test="count(../CodeItem/Description[@lang=($language)][string(.)]) > 0">
												<td>
													<xsl:value-of select="Description[@lang=($language)]"/>
												</td>
											</xsl:if>
										</tr>
									</xsl:if>
								</xsl:for-each>
							</table>
						</div>
					</div>
				</div>
			</div>
		</xsl:for-each>
	</xsl:template>
</xsl:stylesheet>
